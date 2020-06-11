import {
  appendRemoveBackslash,
  createBucketToken,
  createBucketTokenById,
  createBucketTokenByName,
  createProviderToken,
} from './util';

describe('util', () => {
  describe('createProviderToken', () => {
    it('should return provide name with parameter', () => {
      const token = createProviderToken({ id: 'gPetPlus' });
      expect(token).toEqual('gPetPlus.provider');
    });

    it('should return provide name with no parameter', () => {
      const token = createProviderToken();
      expect(token).toEqual('default.provider');
    });
  });

  describe('createBucketToken', () => {
    it('should return provide name with parameter', () => {
      const token = createBucketToken('gPetPlus', 'bucket_01');
      expect(token).toEqual('gPetPlus.bucket_01.bucket');
    });

    it('should return provide name with no parameter', () => {
      const token = createBucketToken();
      expect(token).toEqual('default.undefined.bucket');
    });
  });

  describe('createBucketTokenById', () => {
    it('should return provide name with parameter', () => {
      const token = createBucketTokenById(
        { id: 'gPetPlus' },
        { id: 'bucket_01' },
      );
      expect(token).toEqual('gPetPlus.bucket_01.bucket');
    });

    it('should return bucket provider name with few parameter', () => {
      const token = createBucketTokenById({ id: 'gPetPlus' });
      expect(token).toEqual('gPetPlus.undefined.bucket');
    });

    it('should return bucket provider name with no parameter', () => {
      const token = createBucketTokenById();
      expect(token).toEqual('default.undefined.bucket');
    });
  });

  describe('createBucketTokenByName', () => {
    it('should return provide name with parameter', () => {
      const token = createBucketTokenByName(
        { id: 'gPetPlus' },
        { id: 'bucket_01', name: 'bucket_name_01' },
      );
      expect(token).toEqual('gPetPlus.bucket_name_01.bucket');
    });

    it('should return bucket provider name with few parameter', () => {
      const token = createBucketTokenByName({ id: 'gPetPlus' });
      expect(token).toEqual('gPetPlus.undefined.bucket');
    });

    it('should return bucket provider name with no parameter', () => {
      const token = createBucketTokenByName();
      expect(token).toEqual('default.undefined.bucket');
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
