import { expect } from "chai";

describe("Test Runner", async () => {
  it("Should run chai assertions with Typescript 7", (done: any) => {
    expect(true).to.be.true;
    done();
  });
});