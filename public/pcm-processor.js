class PCMProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.frameSize = options.processorOptions.frameSize || 128;
  }

  process(inputs) {
    const input = inputs[0][0];
    if (!input) return true;
    for (let start = 0; start < input.length; start += this.frameSize) {
      const end = Math.min(start + this.frameSize, input.length);
      const slice = input.slice(start, end);

      const pcm = new Int16Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        pcm[i] = Math.max(-1, Math.min(1, slice[i])) * 0x7fff;
      }

      this.port.postMessage(pcm.buffer);
    }

    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
