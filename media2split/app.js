/* ==========================================================================
   AI Video & Audio Splitter — app.js
   Fully client-side. No media data ever leaves the browser.
   ========================================================================== */

(() => {
  "use strict";

  /* ---------------------------------------------------------------------
     DOM references
     --------------------------------------------------------------------- */
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const chooseFileBtn = document.getElementById("chooseFileBtn");

  const previewSection = document.getElementById("previewSection");
  const videoWrap = document.getElementById("videoWrap");
  const audioWrap = document.getElementById("audioWrap");
  const videoPreview = document.getElementById("videoPreview");
  const audioPreview = document.getElementById("audioPreview");
  const mediaTypeBadge = document.getElementById("mediaTypeBadge");
  const metaFile = document.getElementById("metaFile");
  const metaType = document.getElementById("metaType");
  const metaDuration = document.getElementById("metaDuration");
  const metaResolution = document.getElementById("metaResolution");
  const resolutionRow = document.getElementById("resolutionRow");
  const metaSize = document.getElementById("metaSize");
  const shortVideoWarning = document.getElementById("shortVideoWarning");

  const optionsSection = document.getElementById("optionsSection");
  const clipDurationSelect = document.getElementById("clipDuration");
  const presetButtons = document.querySelectorAll(".preset-btn");
  const outputSizeOptionGroup = document.getElementById("outputSizeOptionGroup");
  const splitBtn = document.getElementById("splitBtn");

  const progressSection = document.getElementById("progressSection");
  const progressStatus = document.getElementById("progressStatus");
  const progressBarFill = document.getElementById("progressBarFill");
  const progressPercent = document.getElementById("progressPercent");

  const resultsSection = document.getElementById("resultsSection");
  const resultsCount = document.getElementById("resultsCount");
  const resultsGrid = document.getElementById("resultsGrid");
  const newVideoBtn = document.getElementById("newVideoBtn");

  const errorBox = document.getElementById("errorBox");

  /* ---------------------------------------------------------------------
     State
     --------------------------------------------------------------------- */
  const state = {
    file: null,
    mediaObjectURL: null,
    mediaType: null,
    extension: "",
    duration: 0,
    width: 0,
    height: 0,
    ffmpeg: null,
    ffmpegLoaded: false,
    clipObjectURLs: [],
    processing: false,
  };

  const MIN_CLIP = 5;
  const MAX_CLIP = 20;
  const VIDEO_EXTENSIONS = ["mp4", "mov", "m4v", "webm"];
  const AUDIO_EXTENSIONS = ["mp3", "wav", "m4a", "aac", "ogg", "oga", "flac", "opus"];

  /* ---------------------------------------------------------------------
     Utility helpers
     --------------------------------------------------------------------- */

  function formatDuration(totalSeconds) {
    const safe = Math.max(0, Number(totalSeconds) || 0);
    const minutes = Math.floor(safe / 60);
    const seconds = safe - (minutes * 60);
    const hasFraction = Math.abs(seconds - Math.round(seconds)) > 0.01;
    const secondText = hasFraction
      ? seconds.toFixed(1).padStart(4, "0")
      : Math.round(seconds).toString().padStart(2, "0");
    return `${minutes.toString().padStart(2, "0")}:${secondText}`;
  }

  function formatClipLength(seconds) {
    const rounded = Math.round(seconds * 10) / 10;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  }

  function formatBytes(bytes) {
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    }
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
    if (bytes >= 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }
    return bytes + " B";
  }

  function sanitizeBaseName(filename) {
    const dot = filename.lastIndexOf(".");
    const base = dot > 0 ? filename.substring(0, dot) : filename;
    return base.replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/^_+|_+$/g, "") || "media";
  }

  function getExtension(filename) {
    const parts = String(filename || "").split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  }

  function detectMediaType(file) {
    if (!file) return null;
    if (file.type && file.type.startsWith("video/")) return "video";
    if (file.type && file.type.startsWith("audio/")) return "audio";

    const extension = getExtension(file.name);
    if (VIDEO_EXTENSIONS.includes(extension)) return "video";
    if (AUDIO_EXTENSIONS.includes(extension)) return "audio";
    return null;
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
    window.scrollTo({ top: errorBox.offsetTop, behavior: "smooth" });
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
  }

  function updateProgress(text, percent) {
    progressStatus.textContent = text;
    const clamped = Math.max(0, Math.min(100, Math.round(percent)));
    progressBarFill.style.width = clamped + "%";
    progressPercent.textContent = clamped + "%";
  }

  /* ---------------------------------------------------------------------
     Segment calculation

     Tiny-remainder rule:
     32s @ 10s -> 10 + 10 + 6 + 6
     If splitting the final target + remainder in half would create clips
     below 5s, the algorithm also absorbs the previous target clip.
     --------------------------------------------------------------------- */

  function calculateSegments(duration, target) {
    const EPSILON = 0.001;

    // Preserve the existing simple behavior: media already inside the
    // supported maximum window stays as one clip.
    if (duration <= MAX_CLIP + EPSILON) {
      return [{ start: 0, length: duration }];
    }

    const fullCount = Math.floor(duration / target);
    const remainder = duration - (fullCount * target);
    const lengths = new Array(fullCount).fill(target);

    if (remainder > EPSILON) {
      if (remainder >= MIN_CLIP - EPSILON) {
        lengths.push(remainder);
      } else {
        // Preferred behavior requested by the user: combine the tiny remainder
        // with the last target clip and split that combined time equally.
        // For very small targets (e.g. 5s), two preceding target clips may be
        // absorbed so both final clips remain at least 5 seconds.
        let adjusted = false;
        const maxConsume = Math.min(2, lengths.length);

        for (let consume = 1; consume <= maxConsume; consume++) {
          const combined = (consume * target) + remainder;
          const half = combined / 2;

          if (half >= MIN_CLIP - EPSILON && half <= MAX_CLIP + EPSILON) {
            lengths.splice(lengths.length - consume, consume, half, half);
            adjusted = true;
            break;
          }
        }

        // Safety fallback. With target values 5–20 this should rarely be
        // needed, but it guarantees no tiny final clip where feasible.
        if (!adjusted) {
          const minClips = Math.ceil(duration / MAX_CLIP);
          const maxClips = Math.floor(duration / MIN_CLIP);
          let count = Math.max(minClips, Math.min(maxClips, Math.round(duration / target)));
          count = Math.max(1, count);
          const evenLength = duration / count;
          lengths.length = 0;
          for (let i = 0; i < count; i++) lengths.push(evenLength);
        }
      }
    }

    // Floating-point safety so the final segment ends exactly at the source end.
    const totalNow = lengths.reduce((sum, value) => sum + value, 0);
    lengths[lengths.length - 1] += duration - totalNow;

    const segments = [];
    let cursor = 0;
    for (const length of lengths) {
      segments.push({ start: cursor, length });
      cursor += length;
    }

    return segments;
  }

  /* ---------------------------------------------------------------------
     Step 1: Load media
     --------------------------------------------------------------------- */

  function loadMedia(file) {
    clearError();

    if (state.processing) {
      showError("Please wait for the current file to finish processing.");
      return;
    }

    const mediaType = detectMediaType(file);
    if (!file || !mediaType) {
      showError("Please choose a supported video or audio file.");
      return;
    }

    resetResultsOnly();
    progressSection.classList.add("hidden");

    if (state.mediaObjectURL) {
      URL.revokeObjectURL(state.mediaObjectURL);
    }

    videoPreview.pause();
    audioPreview.pause();
    videoPreview.removeAttribute("src");
    audioPreview.removeAttribute("src");
    videoPreview.load();
    audioPreview.load();

    state.file = file;
    state.mediaType = mediaType;
    state.extension = getExtension(file.name);
    state.mediaObjectURL = URL.createObjectURL(file);
    state.width = 0;
    state.height = 0;

    if (mediaType === "video") {
      videoWrap.classList.remove("hidden");
      audioWrap.classList.add("hidden");
      videoPreview.src = state.mediaObjectURL;

      videoPreview.onloadedmetadata = () => {
        if (!isFinite(videoPreview.duration)) {
          fixInfiniteDuration(videoPreview, file);
        } else {
          getMediaMetadata(file, videoPreview);
        }
      };
      videoPreview.onerror = () => showError("Unable to read this video in your browser.");
    } else {
      videoWrap.classList.add("hidden");
      audioWrap.classList.remove("hidden");
      audioPreview.src = state.mediaObjectURL;

      audioPreview.onloadedmetadata = () => {
        if (!isFinite(audioPreview.duration)) {
          fixInfiniteDuration(audioPreview, file);
        } else {
          getMediaMetadata(file, audioPreview);
        }
      };
      audioPreview.onerror = () => showError("Unable to read this audio file in your browser.");
    }
  }

  function fixInfiniteDuration(mediaElement, file) {
    let done = false;
    const onTimeUpdate = () => {
      if (done) return;
      done = true;
      mediaElement.removeEventListener("timeupdate", onTimeUpdate);
      mediaElement.currentTime = 0;
      getMediaMetadata(file, mediaElement);
    };

    mediaElement.addEventListener("timeupdate", onTimeUpdate);
    mediaElement.currentTime = 1e101;

    setTimeout(() => {
      if (!done && !isFinite(mediaElement.duration)) {
        mediaElement.removeEventListener("timeupdate", onTimeUpdate);
        showError(`Unable to read this ${state.mediaType || "media"} file.`);
      }
    }, 3000);
  }

  function getMediaMetadata(file, mediaElement) {
    const duration = mediaElement.duration;
    if (!isFinite(duration) || duration <= 0) {
      showError(`Unable to read this ${state.mediaType || "media"} file.`);
      return;
    }

    state.duration = duration;

    if (state.mediaType === "video") {
      const width = videoPreview.videoWidth;
      const height = videoPreview.videoHeight;
      if (!width || !height) {
        showError("Unable to read this video.");
        return;
      }
      state.width = width;
      state.height = height;
      metaResolution.textContent = `${width} × ${height}`;
      resolutionRow.classList.remove("hidden");
      outputSizeOptionGroup.classList.remove("hidden");
      optionsSection.classList.remove("audio-mode");
      splitBtn.textContent = "Split Video";
      mediaTypeBadge.textContent = "VIDEO";
      metaType.textContent = "Video";
    } else {
      state.width = 0;
      state.height = 0;
      metaResolution.textContent = "-";
      resolutionRow.classList.add("hidden");
      outputSizeOptionGroup.classList.add("hidden");
      optionsSection.classList.add("audio-mode");
      splitBtn.textContent = "Split Audio";
      mediaTypeBadge.textContent = "AUDIO";
      metaType.textContent = "Audio";
    }

    metaFile.textContent = file.name;
    metaDuration.textContent = formatDuration(duration);
    metaSize.textContent = formatBytes(file.size);

    if (duration < MIN_CLIP) {
      shortVideoWarning.classList.remove("hidden");
    } else {
      shortVideoWarning.classList.add("hidden");
    }

    previewSection.classList.remove("hidden");
    optionsSection.classList.remove("hidden");
    splitBtn.disabled = false;
  }

  /* ---------------------------------------------------------------------
     Step 2: Load FFmpeg (unchanged stable HTTPS loader)
     --------------------------------------------------------------------- */

  async function loadFFmpeg() {
    if (state.ffmpegLoaded) return state.ffmpeg;

    updateProgress("Loading media engine...", 2);

    if (!window.FFmpegWASM || !window.FFmpegUtil) {
      throw new Error("Local FFmpeg wrapper did not load.");
    }

    const { FFmpeg } = window.FFmpegWASM;
    const { toBlobURL } = window.FFmpegUtil;

    const ffmpeg = new FFmpeg();
    const coreBaseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";

    ffmpeg.on("log", () => {
      /* silent - avoid noisy console in production */
    });

    const blobURLs = [];
    try {
      const [coreURL, wasmURL] = await Promise.all([
        toBlobURL(`${coreBaseURL}/ffmpeg-core.js`, "text/javascript"),
        toBlobURL(`${coreBaseURL}/ffmpeg-core.wasm`, "application/wasm"),
      ]);
      blobURLs.push(coreURL, wasmURL);

      await ffmpeg.load({ coreURL, wasmURL });
    } catch (err) {
      console.error("FFmpeg failed to load:", err);
      try {
        ffmpeg.terminate();
      } catch (e) {
        /* worker may not have started */
      }
      throw new Error("Media processing failed. Please try again.");
    } finally {
      blobURLs.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          /* ignore cleanup errors */
        }
      });
    }

    state.ffmpeg = ffmpeg;
    state.ffmpegLoaded = true;

    updateProgress("Media engine ready", 5);
    return ffmpeg;
  }

  /* ---------------------------------------------------------------------
     Step 3: Split
     --------------------------------------------------------------------- */

  async function splitMedia() {
    clearError();

    const target = parseInt(clipDurationSelect.value, 10);
    if (!state.file || !state.duration || !state.mediaType || target < MIN_CLIP || target > MAX_CLIP) {
      showError("Please select a media file and a valid clip duration.");
      return;
    }

    const checkedSize = document.querySelector('input[name="outputSize"]:checked');
    const outputScale = state.mediaType === "video" && checkedSize ? checkedSize.value : "100";
    const mediaWord = state.mediaType === "audio" ? "audio" : "video";

    state.processing = true;
    splitBtn.disabled = true;
    optionsSection.classList.add("hidden");
    progressSection.classList.remove("hidden");
    resultsSection.classList.add("hidden");
    updateProgress(`Preparing ${mediaWord}...`, 0);

    const clipUrlStartCount = state.clipObjectURLs.length;

    let ffmpeg = null;
    let progressHandler = null;
    let inputName = null;
    let mountedInput = false;

    try {
      const { fetchFile } = FFmpegUtil;
      ffmpeg = await loadFFmpeg();

      updateProgress(`Preparing ${mediaWord}...`, 8);

      const defaultExt = state.mediaType === "audio" ? "m4a" : "mp4";
      const inputExt = state.extension || defaultExt;
      const safeInputFileName = `source.${inputExt.replace(/[^a-z0-9]/g, "") || defaultExt}`;

      try {
        try {
          await ffmpeg.createDir("/input");
        } catch (e) {
          /* directory may already exist */
        }
        await ffmpeg.mount("WORKERFS", { files: [state.file] }, "/input");
        inputName = `/input/${state.file.name}`;
        mountedInput = true;
      } catch (mountError) {
        console.warn("WORKERFS unavailable, falling back to in-memory input:", mountError);
        try { await ffmpeg.unmount("/input"); } catch (e) { /* not mounted */ }
        try { await ffmpeg.deleteDir("/input"); } catch (e) { /* ignore */ }
        inputName = safeInputFileName;
        await ffmpeg.writeFile(inputName, await fetchFile(state.file));
      }

      const segments = calculateSegments(state.duration, target);
      const total = segments.length;
      const baseName = sanitizeBaseName(state.file.name);
      const clips = [];

      let segmentProgress = 0;
      progressHandler = ({ progress }) => {
        if (progress >= 0 && progress <= 1) {
          segmentProgress = progress;
          const overall = ((clips.length + segmentProgress) / total) * 100;
          updateProgress(`Splitting ${mediaWord} clip ${clips.length + 1} of ${total}...`, overall);
        }
      };
      ffmpeg.on("progress", progressHandler);

      for (let i = 0; i < segments.length; i++) {
        segmentProgress = 0;
        updateProgress(`Splitting ${mediaWord} clip ${i + 1} of ${total}...`, (i / total) * 100);

        const clip = state.mediaType === "audio"
          ? await processAudioSegment(ffmpeg, inputName, segments[i], i, baseName)
          : await processVideoSegment(ffmpeg, inputName, segments[i], i, outputScale, baseName);

        clips.push(clip);

        try {
          await ffmpeg.deleteFile(clip.tempName);
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      }

      updateProgress("Finishing...", 98);
      await new Promise((resolve) => setTimeout(resolve, 150));
      updateProgress("Done", 100);

      renderResults(clips);
    } catch (err) {
      console.error(err);
      state.clipObjectURLs
        .splice(clipUrlStartCount)
        .forEach((url) => URL.revokeObjectURL(url));
      handleProcessingError(err);
    } finally {
      if (ffmpeg && progressHandler) {
        try {
          ffmpeg.off("progress", progressHandler);
        } catch (e) {
          console.error("Listener cleanup error:", e);
        }
      }

      if (ffmpeg && inputName) {
        if (mountedInput) {
          try { await ffmpeg.unmount("/input"); } catch (e) { console.error("Input unmount error:", e); }
          try { await ffmpeg.deleteDir("/input"); } catch (e) { /* ignore */ }
        } else {
          try { await ffmpeg.deleteFile(inputName); } catch (e) { /* ignore */ }
        }
      }

      state.processing = false;
      splitBtn.disabled = false;
    }
  }

  function handleProcessingError(err) {
    progressSection.classList.add("hidden");
    optionsSection.classList.remove("hidden");

    const message = (err && err.message) ? err.message.toLowerCase() : "";
    if (message.includes("memory") || message.includes("out of bounds") || message.includes("allocation")) {
      showError("Not enough browser memory to process this file. Try a smaller file or, for video, choose 50% output.");
    } else if (message.includes("format") || message.includes("invalid data")) {
      showError("This media format could not be processed.");
    } else {
      showError("Media processing failed. Please try again.");
    }
  }

  async function processVideoSegment(ffmpeg, inputName, segment, index, outputScale, baseName) {
    const clipNumber = (index + 1).toString().padStart(3, "0");
    const durationLabel = formatClipLength(segment.length);
    const tempName = `output_${clipNumber}.mp4`;
    const fileName = `${baseName}_part-${clipNumber}_${durationLabel}s.mp4`;

    const factor = outputScale === "100" ? 1 : parseInt(outputScale, 10) / 100;
    const scaleFilter = `scale=trunc(iw*${factor}/2)*2:trunc(ih*${factor}/2)*2`;

    const args = [
      "-ss", segment.start.toFixed(3),
      "-i", inputName,
      "-t", segment.length.toFixed(3),
      "-map", "0:v:0",
      "-map", "0:a:0?",
      "-vf", scaleFilter,
      "-c:v", "libx264",
      "-crf", "20",
      "-preset", "veryfast",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac",
      "-b:a", "160k",
      "-sn",
      "-dn",
      "-movflags", "+faststart",
      "-avoid_negative_ts", "make_zero",
      tempName,
    ];

    await executeAndValidate(ffmpeg, args, tempName);
    const data = await ffmpeg.readFile(tempName);
    if (!data || data.length === 0) throw new Error("FFmpeg produced an empty output file");
    const blob = new Blob([data], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    state.clipObjectURLs.push(url);

    const outWidth = Math.max(2, Math.trunc((state.width * factor) / 2) * 2);
    const outHeight = Math.max(2, Math.trunc((state.height * factor) / 2) * 2);

    return {
      mediaType: "video",
      index: index + 1,
      start: segment.start,
      end: segment.start + segment.length,
      duration: segment.length,
      width: outWidth,
      height: outHeight,
      format: "MP4",
      url,
      fileName,
      tempName,
    };
  }

  async function processAudioSegment(ffmpeg, inputName, segment, index, baseName) {
    const clipNumber = (index + 1).toString().padStart(3, "0");
    const durationLabel = formatClipLength(segment.length);
    const tempName = `audio_${clipNumber}.m4a`;
    const fileName = `${baseName}_part-${clipNumber}_${durationLabel}s.m4a`;

    // Use AAC/M4A as a consistent browser-friendly output for all supported
    // audio inputs while preserving accurate requested split times.
    const args = [
      "-ss", segment.start.toFixed(3),
      "-i", inputName,
      "-t", segment.length.toFixed(3),
      "-map", "0:a:0",
      "-vn",
      "-c:a", "aac",
      "-b:a", "192k",
      "-movflags", "+faststart",
      "-avoid_negative_ts", "make_zero",
      tempName,
    ];

    await executeAndValidate(ffmpeg, args, tempName);
    const data = await ffmpeg.readFile(tempName);
    if (!data || data.length === 0) throw new Error("FFmpeg produced an empty output file");
    const blob = new Blob([data], { type: "audio/mp4" });
    const url = URL.createObjectURL(blob);
    state.clipObjectURLs.push(url);

    return {
      mediaType: "audio",
      index: index + 1,
      start: segment.start,
      end: segment.start + segment.length,
      duration: segment.length,
      width: null,
      height: null,
      format: "M4A (AAC)",
      url,
      fileName,
      tempName,
    };
  }

  async function executeAndValidate(ffmpeg, args, tempName) {
    const exitCode = await ffmpeg.exec(args);
    if (exitCode !== 0) {
      try { await ffmpeg.deleteFile(tempName); } catch (e) { /* no partial output */ }
      throw new Error(`FFmpeg encode failed with exit code ${exitCode}`);
    }
  }

  /* ---------------------------------------------------------------------
     Step 4: Render results
     --------------------------------------------------------------------- */

  function renderResults(clips) {
    progressSection.classList.add("hidden");
    resultsGrid.innerHTML = "";

    const typeWord = state.mediaType === "audio" ? "audio clip" : "video clip";
    resultsCount.textContent = `${clips.length} ${typeWord}${clips.length === 1 ? "" : "s"} created`;

    clips.forEach((clip) => {
      const card = document.createElement("div");
      card.className = "clip-card";

      if (clip.mediaType === "audio") {
        const shell = document.createElement("div");
        shell.className = "clip-audio-shell";

        const audio = document.createElement("audio");
        audio.className = "clip-audio";
        audio.src = clip.url;
        audio.controls = true;
        audio.preload = "metadata";
        shell.appendChild(audio);
        card.appendChild(shell);
      } else {
        const video = document.createElement("video");
        video.className = "clip-video";
        video.src = clip.url;
        video.controls = true;
        video.preload = "metadata";
        video.playsInline = true;
        card.appendChild(video);
      }

      const info = document.createElement("div");
      info.className = "clip-info";

      const title = document.createElement("p");
      title.className = "clip-title";
      title.textContent = `Clip ${clip.index.toString().padStart(2, "0")}`;

      const timeRange = document.createElement("p");
      timeRange.className = "clip-meta";
      timeRange.textContent = `${formatDuration(clip.start)} to ${formatDuration(clip.end)}`;

      const durationLine = document.createElement("p");
      durationLine.className = "clip-meta";
      durationLine.textContent = `${formatClipLength(clip.duration)} seconds`;

      const detailLine = document.createElement("p");
      detailLine.className = "clip-meta";
      detailLine.textContent = clip.mediaType === "video"
        ? `${clip.width} × ${clip.height}`
        : clip.format;

      const downloadLink = document.createElement("a");
      downloadLink.className = "clip-download";
      downloadLink.href = clip.url;
      downloadLink.download = clip.fileName;
      downloadLink.target = "_blank";
      downloadLink.rel = "noopener";
      downloadLink.textContent = "Download";

      info.appendChild(title);
      info.appendChild(timeRange);
      info.appendChild(durationLine);
      info.appendChild(detailLine);
      info.appendChild(downloadLink);
      card.appendChild(info);
      resultsGrid.appendChild(card);
    });

    resultsSection.classList.remove("hidden");
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------------------------------------------------------------------
     Reset
     --------------------------------------------------------------------- */

  function resetResultsOnly() {
    state.clipObjectURLs.forEach((url) => URL.revokeObjectURL(url));
    state.clipObjectURLs = [];
    resultsGrid.innerHTML = "";
    resultsSection.classList.add("hidden");
  }

  function resetApp() {
    clearError();

    if (state.mediaObjectURL) {
      URL.revokeObjectURL(state.mediaObjectURL);
      state.mediaObjectURL = null;
    }
    resetResultsOnly();

    videoPreview.pause();
    audioPreview.pause();
    videoPreview.removeAttribute("src");
    audioPreview.removeAttribute("src");
    videoPreview.load();
    audioPreview.load();

    state.file = null;
    state.mediaType = null;
    state.extension = "";
    state.duration = 0;
    state.width = 0;
    state.height = 0;

    metaFile.textContent = "-";
    metaType.textContent = "-";
    metaDuration.textContent = "-";
    metaResolution.textContent = "-";
    metaSize.textContent = "-";
    shortVideoWarning.classList.add("hidden");
    videoWrap.classList.remove("hidden");
    audioWrap.classList.add("hidden");
    resolutionRow.classList.remove("hidden");
    outputSizeOptionGroup.classList.remove("hidden");
    optionsSection.classList.remove("audio-mode");
    mediaTypeBadge.textContent = "VIDEO";

    previewSection.classList.add("hidden");
    optionsSection.classList.add("hidden");
    progressSection.classList.add("hidden");
    resultsSection.classList.add("hidden");

    splitBtn.disabled = true;
    splitBtn.textContent = "Split Media";
    fileInput.value = "";

    clipDurationSelect.value = "10";
    presetButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.value === "10");
    });
    const originalSize = document.querySelector('input[name="outputSize"][value="100"]');
    if (originalSize) originalSize.checked = true;

    updateProgress("", 0);
  }

  /* ---------------------------------------------------------------------
     Event wiring
     --------------------------------------------------------------------- */

  chooseFileBtn.addEventListener("click", () => {
    if (state.processing) {
      showError("Please wait for the current file to finish processing.");
      return;
    }
    fileInput.click();
  });

  dropzone.addEventListener("click", (e) => {
    if (e.target === chooseFileBtn) return;
    if (state.processing) {
      showError("Please wait for the current file to finish processing.");
      return;
    }
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) loadMedia(file);
    fileInput.value = "";
  });

  ["dragenter", "dragover"].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!state.processing) dropzone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("dragover");
    });
  });

  dropzone.addEventListener("drop", (e) => {
    if (state.processing) {
      showError("Please wait for the current file to finish processing.");
      return;
    }
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) loadMedia(file);
  });

  presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.value;
      clipDurationSelect.value = value;
      presetButtons.forEach((b) => b.classList.toggle("active", b === btn));
    });
  });

  clipDurationSelect.addEventListener("change", () => {
    const value = clipDurationSelect.value;
    presetButtons.forEach((b) => b.classList.toggle("active", b.dataset.value === value));
  });

  splitBtn.addEventListener("click", splitMedia);
  newVideoBtn.addEventListener("click", resetApp);

  splitBtn.disabled = true;
})();

/* PWA service worker registration. Splitter logic above remains unchanged. */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  });
}
