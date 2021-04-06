import { strict as assert } from 'assert';
import { test } from '../src/app.js';
describe('Example test', () => {
    describe('test()', () => {
        it('should return 3 when it has a passed parameter of 2', () => {
            // Arrange
            const testData = 2;
            const expectedResult = 3;
            // Act
            const result = test(testData);
            // Assert
            assert.strictEqual(result, expectedResult);
        });
    });
});
//# sourceMappingURL=app-test.js.map