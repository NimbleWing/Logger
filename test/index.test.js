import StdMocks from 'std-mocks';
import { expect } from 'chai';
import Logger from '../src/index';

process.env.NODE_ENV = 'production';
describe('logger test', () => {
  it('with scope', () => {
    const logger = new Logger();
    StdMocks.use();
    logger.info('ss');
    StdMocks.restore();
    const output = StdMocks.flush();
    expect(output.stdout[0]).to.be.contains('main');
  });
});
