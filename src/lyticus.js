export default function Lyticus(clientName, clientProvider) {
  return {
    track(type, name, properties) {
      switch (clientName) {
        case 'segment':
          clientProvider().track(`${type}--${name}`, properties);
          break;
        default:
          throw new Error('Method not supported');
      }
    }
  };
}
