export default function Lyticus(clientName, clientProvider) {
  switch (clientName) {
    case 'segment':
      return {
        page(name) {
          clientProvider().page(name);
        },
        track(type, name, properties) {
          clientProvider().track(`${type}--${name}`, properties);
        }
      };
    default:
      throw new Error('Client not supported');
  }
}
