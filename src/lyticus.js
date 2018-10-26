export default function Lyticus(clientName, clientProvider) {
  switch (clientName) {
    case 'segment':
      const page = name => {
        clientProvider().page(name);
      };
      const track = (type, name, properties) => {
        clientProvider().track(`${type}--${name}`, properties);
      };
      const addDocumentTracker = (eventType, selectorStrings) => {
        document.addEventListener(eventType, event => {
          const { target } = event;
          for (let index = 0; index < selectorStrings.length; index++) {
            const selectorString = selectorStrings[index];
            if (target.matches(selectorString)) {
              let name = null;
              let properties = null;
              // Parse id
              if (target.id) {
                name = target.id;
              }
              // Parse attributes
              if (target.attributes) {
                // -- Ignore
                const ingoreAttribute = target.attributes.getNamedItem(
                  'data-track-ignore'
                );
                if (ingoreAttribute) {
                  return;
                }
                // -- Name
                const nameAttribute = target.attributes.getNamedItem(
                  'data-track-name'
                );
                if (nameAttribute) {
                  name = nameAttribute.value;
                }
                // -- Properties
                const propertiesAttribute = target.attributes.getNamedItem(
                  'data-track-properties'
                );
                if (propertiesAttribute) {
                  properties = propertiesAttribute.value;
                }
              }
              if (event) {
                track(eventType, name, properties);
              }
              break;
            }
          }
        });
      };
      return {
        page,
        track,
        addDocumentTracker
      };
    default:
      throw new Error('Client not supported');
  }
}
