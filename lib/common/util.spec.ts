import {
  appendRemoveBackslash,
  createS3BucketToken,
  createS3StorageToken,
  createGSBucketToken,
  createGSStorageToken,
  createNSServiceToken,
} from "./util";

describe('util', () => {

  describe('createNSServiceToken', () => {
    it('should return default token', () => {
      const str = createNSServiceToken();
      expect(str).toEqual('default.service');
    });

    it('should return id service token', () => {
      const str = createNSServiceToken('bla');
      expect(str).toEqual('bla.service');
    });
  });

  describe("createS3StorageToken", () => {
    it("should return provide name with parameter", () => {
      const token = createS3StorageToken({ id: "gPetPlus" });
      expect(token).toEqual("aws.gPetPlus.storage");
    });

    it("should return provide name with no parameter", () => {
      const token = createS3StorageToken();
      expect(token).toEqual("aws.default.storage");
    });
  });

  describe("createS3BucketToken", () => {
    it("should return provide name with parameter", () => {
      const token = createS3BucketToken({ id: "gPetPlus" }, { id: "bucket_01" });
      expect(token).toEqual("aws.gPetPlus.bucket_01.bucket");
    });

    it("should return provide name with no parameter", () => {
      const token = createS3BucketToken();
      expect(token).toEqual("aws.default.undefined.bucket");
    });
  });

  describe("createGSStorageToken", () => {
    it("should return provide name with parameter", () => {
      const token = createGSStorageToken({ id: "gPetPlus" });
      expect(token).toEqual("google.gPetPlus.storage");
    });

    it("should return provide name with no parameter", () => {
      const token = createGSStorageToken();
      expect(token).toEqual("google.default.storage");
    });
  });

  describe("createGSBucketToken", () => {
    it("should return provide name with parameter", () => {
      const token = createGSBucketToken({ id: "gPetPlus" }, { id: "bucket_01" });
      expect(token).toEqual("google.gPetPlus.bucket_01.bucket");
    });

    it("should return provide name with no parameter", () => {
      const token = createGSBucketToken();
      expect(token).toEqual("google.default.undefined.bucket");
    });
  });

  describe('addFirstCharBackslash', () => {
    describe('append', () => {
      it('should add backslash', () => {
        const str = appendRemoveBackslash('bla/ble');
        expect(str).toEqual('/bla/ble');
      });

      it('should keep backslash', () => {
        const str = appendRemoveBackslash('/bla/ble');
        expect(str).toEqual('/bla/ble');
      });

      it('should return undefined', () => {
        const str = appendRemoveBackslash(undefined);
        expect(str).toBeUndefined();
      });
    });

    describe('remove', () => {
      it('should remove backslash', () => {
        const str = appendRemoveBackslash('/bla/ble', false);
        expect(str).toEqual('bla/ble');
      });

      it('should keep removed backslash', () => {
        const str = appendRemoveBackslash('bla/ble', false);
        expect(str).toEqual('bla/ble');
      });

      it('should return undefined', () => {
        const str = appendRemoveBackslash(undefined, false);
        expect(str).toBeUndefined();
      });
    });
  });
});
