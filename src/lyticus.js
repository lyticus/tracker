export default function Lyticus(clientName, clientProvider) {
  switch (clientName) {
    case 'segment':
      return {
        page(name) {
          clientProvider().page(name);
        },
        track(type, name, properties) {
          clientProvider().track(`${type}--${name}`, properties);
        },
        addDocumentTracker(eventType, tagNames) {
          document.addEventListener(eventType, event => {
            const { target } = event;
            const { tagName } = target;
            if (tagNames.includes(tagName)) {
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
            }
          });
        }
      };
    default:
      throw new Error('Client not supported');
  }
}
