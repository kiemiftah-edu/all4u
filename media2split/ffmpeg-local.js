/*
 * Minimal local wrapper for ffmpeg.wasm 0.12 message protocol.
 * Keeps the top-level Web Worker same-origin so static HTTPS hosting works.
 * The heavy ffmpeg-core JS/WASM may still be fetched from a CDN as Blob URLs.
 */
(() => {
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

  let messageId = 0;
  const nextMessageId = () => ++messageId;

  class FFmpeg {
    constructor() {
      this.worker = null;
      this.resolves = new Map();
      this.rejects = new Map();
      this.logCallbacks = [];
      this.progressCallbacks = [];
      this.loaded = false;
    }

    registerHandlers() {
      if (!this.worker) return;

      this.worker.onmessage = ({ data: { id, type, data } }) => {
        if (type === FFMessageType.LOG) {
          this.logCallbacks.forEach((callback) => callback(data));
          return;
        }

        if (type === FFMessageType.PROGRESS) {
          this.progressCallbacks.forEach((callback) => callback(data));
          return;
        }

        if (type === FFMessageType.ERROR) {
          const reject = this.rejects.get(id);
          if (reject) reject(data instanceof Error ? data : new Error(String(data)));
          this.resolves.delete(id);
          this.rejects.delete(id);
          return;
        }

        if (type === FFMessageType.LOAD) {
          this.loaded = true;
        }

        const resolve = this.resolves.get(id);
        if (resolve) resolve(data);
        this.resolves.delete(id);
        this.rejects.delete(id);
      };

      this.worker.onerror = (event) => {
        const error = new Error(event.message || "FFmpeg worker failed.");
        for (const reject of this.rejects.values()) reject(error);
        this.resolves.clear();
        this.rejects.clear();
      };
    }

    send(type, data, transfer = []) {
      if (!this.worker) {
        return Promise.reject(new Error("ffmpeg is not loaded, call await ffmpeg.load() first"));
      }

      return new Promise((resolve, reject) => {
        const id = nextMessageId();
        this.resolves.set(id, resolve);
        this.rejects.set(id, reject);
        this.worker.postMessage({ id, type, data }, transfer);
      });
    }

    on(event, callback) {
      if (event === "log") this.logCallbacks.push(callback);
      if (event === "progress") this.progressCallbacks.push(callback);
    }

    off(event, callback) {
      if (event === "log") {
        this.logCallbacks = this.logCallbacks.filter((fn) => fn !== callback);
      }
      if (event === "progress") {
        this.progressCallbacks = this.progressCallbacks.filter((fn) => fn !== callback);
      }
    }

    async load(config = {}) {
      if (!this.worker) {
        // IMPORTANT: same-origin worker. This is the fix for CDN worker errors.
        const workerURL = new URL("ffmpeg-worker.js", document.baseURI).href;
        this.worker = new Worker(workerURL);
        this.registerHandlers();
      }
      return this.send(FFMessageType.LOAD, config);
    }

    exec(args, timeout = -1) {
      return this.send(FFMessageType.EXEC, { args, timeout });
    }

    writeFile(path, data) {
      const transfer = [];
      if (data instanceof Uint8Array) transfer.push(data.buffer);
      return this.send(FFMessageType.WRITE_FILE, { path, data }, transfer);
    }

    readFile(path, encoding = "binary") {
      return this.send(FFMessageType.READ_FILE, { path, encoding });
    }

    deleteFile(path) {
      return this.send(FFMessageType.DELETE_FILE, { path });
    }

    rename(oldPath, newPath) {
      return this.send(FFMessageType.RENAME, { oldPath, newPath });
    }

    createDir(path) {
      return this.send(FFMessageType.CREATE_DIR, { path });
    }

    listDir(path) {
      return this.send(FFMessageType.LIST_DIR, { path });
    }

    deleteDir(path) {
      return this.send(FFMessageType.DELETE_DIR, { path });
    }

    mount(fsType, options, mountPoint) {
      return this.send(FFMessageType.MOUNT, { fsType, options, mountPoint });
    }

    unmount(mountPoint) {
      return this.send(FFMessageType.UNMOUNT, { mountPoint });
    }

    terminate() {
      const error = new Error("called FFmpeg.terminate()");
      for (const reject of this.rejects.values()) reject(error);
      this.resolves.clear();
      this.rejects.clear();

      if (this.worker) {
        this.worker.terminate();
        this.worker = null;
      }
      this.loaded = false;
    }
  }

  async function toBlobURL(url, mimeType) {
    const response = await fetch(url, { mode: "cors", cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`Failed to download ${url} (${response.status})`);
    }
    const buffer = await response.arrayBuffer();
    return URL.createObjectURL(new Blob([buffer], { type: mimeType }));
  }

  async function fetchFile(source) {
    if (source instanceof Uint8Array) return source;
    if (source instanceof ArrayBuffer) return new Uint8Array(source);
    if (source instanceof Blob) return new Uint8Array(await source.arrayBuffer());

    const response = await fetch(source);
    if (!response.ok) throw new Error(`Failed to fetch file (${response.status})`);
    return new Uint8Array(await response.arrayBuffer());
  }

  // Preserve the names used by Version 1 so the rest of the app stays intact.
  window.FFmpegWASM = { FFmpeg };
  window.FFmpegUtil = { toBlobURL, fetchFile };
})();
