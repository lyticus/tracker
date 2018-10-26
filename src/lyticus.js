export default function Lyticus() {
  return {
    track(type, name, payload) {
      console.log('tracked', type, name, payload);
    }
  };
}
