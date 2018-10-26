export default function Lyticus(clientName, clientInstance) {
  return {
    track(type, name, properties) {
      switch (clientName) {
        case 'segment':
          clientInstance.track(`${type}--${name}`, properties);
          break;
        default:
          throw new Error('Method not supported');
      }
    }
  };
}
