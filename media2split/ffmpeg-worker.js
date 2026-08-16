/*
 * Same-origin classic worker for ffmpeg.wasm core 0.12.x.
 * Message protocol follows the official @ffmpeg/ffmpeg worker.
 */
"use strict";

const FFMessageType = Object.freeze({
  LOAD: "LOAD",
  EXEC: "EXEC",
  WRITE_FILE: "WRITE_FILE",
  READ_FILE: "READ_FILE",
  DELETE_FILE: "DELETE_FILE",
  RENAME: "RENAME",
  CREATE_DIR: "CREATE_DIR",
  LIST_DIR: "LIST_DIR",
  DELETE_DIR: "DELETE_DIR",
  ERROR: "ERROR",
  DOWNLOAD: "DOWNLOAD",
  PROGRESS: "PROGRESS",
  LOG: "LOG",
  MOUNT: "MOUNT",
  UNMOUNT: "UNMOUNT",
});

let ffmpeg = null;

async function loadCore({ coreURL, wasmURL, workerURL }) {
  const first = !ffmpeg;
  if (!coreURL) throw new Error("Missing ffmpeg coreURL");

  try {
    importScripts(coreURL);
  } catch (error) {
    console.error("Unable to import ffmpeg core:", error);
    throw new Error("failed to import ffmpeg-core.js");
  }

  if (typeof self.createFFmpegCore !== "function") {
    throw new Error("failed to import ffmpeg-core.js");
  }

  const resolvedWasmURL = wasmURL || coreURL.replace(/\.js$/i, ".wasm");
  const resolvedWorkerURL = workerURL || coreURL.replace(/\.js$/i, ".worker.js");

  ffmpeg = await self.createFFmpegCore({
    mainScriptUrlOrBlob: `${coreURL}#${btoa(
      JSON.stringify({ wasmURL: resolvedWasmURL, workerURL: resolvedWorkerURL })
    )}`,
  });

  ffmpeg.setLogger((data) => self.postMessage({ type: FFMessageType.LOG, data }));
  ffmpeg.setProgress((data) => self.postMessage({ type: FFMessageType.PROGRESS, data }));

  return first;
}

function execCommand({ args, timeout = -1 }) {
  ffmpeg.setTimeout(timeout);
  ffmpeg.exec(...args);
  const ret = ffmpeg.ret;
  ffmpeg.reset();
  return ret;
}

function writeFile({ path, data }) {
  ffmpeg.FS.writeFile(path, data);
  return true;
}

function readFile({ path, encoding = "binary" }) {
  return ffmpeg.FS.readFile(path, { encoding });
}

function deleteFile({ path }) {
  ffmpeg.FS.unlink(path);
  return true;
}

function rename({ oldPath, newPath }) {
  ffmpeg.FS.rename(oldPath, newPath);
  return true;
}

function createDir({ path }) {
  ffmpeg.FS.mkdir(path);
  return true;
}

function listDir({ path }) {
  return ffmpeg.FS.readdir(path).map((name) => {
    const stat = ffmpeg.FS.stat(`${path}/${name}`);
    return { name, isDir: ffmpeg.FS.isDir(stat.mode) };
  });
}

function deleteDir({ path }) {
  ffmpeg.FS.rmdir(path);
  return true;
}

function mount({ fsType, options, mountPoint }) {
  const fs = ffmpeg.FS.filesystems[fsType];
  if (!fs) return false;
  ffmpeg.FS.mount(fs, options, mountPoint);
  return true;
}

function unmount({ mountPoint }) {
  ffmpeg.FS.unmount(mountPoint);
  return true;
}

self.onmessage = async ({ data: { id, type, data } }) => {
  let result;
  const transfer = [];

  try {
    if (type !== FFMessageType.LOAD && !ffmpeg) {
      throw new Error("ffmpeg is not loaded, call await ffmpeg.load() first");
    }

    switch (type) {
      case FFMessageType.LOAD:
        result = await loadCore(data || {});
        break;
      case FFMessageType.EXEC:
        result = execCommand(data);
        break;
      case FFMessageType.WRITE_FILE:
        result = writeFile(data);
        break;
      case FFMessageType.READ_FILE:
        result = readFile(data);
        break;
      case FFMessageType.DELETE_FILE:
        result = deleteFile(data);
        break;
      case FFMessageType.RENAME:
        result = rename(data);
        break;
      case FFMessageType.CREATE_DIR:
        result = createDir(data);
        break;
      case FFMessageType.LIST_DIR:
        result = listDir(data);
        break;
      case FFMessageType.DELETE_DIR:
        result = deleteDir(data);
        break;
      case FFMessageType.MOUNT:
        result = mount(data);
        break;
      case FFMessageType.UNMOUNT:
        result = unmount(data);
        break;
      default:
        throw new Error(`Unknown FFmpeg message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      id,
      type: FFMessageType.ERROR,
      data: error instanceof Error ? error.message : String(error),
    });
    return;
  }

  if (result instanceof Uint8Array) transfer.push(result.buffer);
  self.postMessage({ id, type, data: result }, transfer);
};
