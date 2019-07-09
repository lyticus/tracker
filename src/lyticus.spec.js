import Lyticus from "./lyticus";

const TEST_WEBSITE_ID = "test-website-id";

test("constructor without websiteId throws error", () => {
  expect(() => new Lyticus()).toThrowError(
    new Error("websiteId must be defined")
  );
});

test("constructor without options falls back to default options", () => {
  expect(new Lyticus(TEST_WEBSITE_ID).options.cookies).toEqual(true);
});

test("constructor with options throws error if options is not an object", () => {
  expect(() => new Lyticus(TEST_WEBSITE_ID, "I am a string")).toThrowError(
    new Error("options must be an object")
  );
});
