import 'jsdom-global/register';

import * as chai  from 'chai';
import * as sinon from 'sinon';

import RendererFacade  from '../Tree/RendererFacade';
import {createFactory} from './factory';
import IFactory        from './Interfaces/IFactory';

const {assert} = chai;
const {spy} = sinon;

interface ITestContext {
    factory: IFactory;
    MockFacade: sinon.SinonSpy;
}

describe('factory()', function() {
    // @ts-ignore
    const self: ITestContext = this;

    beforeEach(() => {
        self.MockFacade = spy();
        self.factory = createFactory(self.MockFacade);
    });

    it('returns an instance of `TomeFacade`', () => {
        const root = document.createElement('div');

        const editor = self.factory(root);

        assert.instanceOf(editor, self.MockFacade);
        assert.isTrue(self.MockFacade.calledOnce);
        assert.isTrue(self.MockFacade.calledWith(root));
    });

    it('passes consumer-provided configuration options to the facade', () => {
        const root = document.createElement('div');
        const options = {};

        self.factory(root, options);

        assert.equal(self.MockFacade.firstCall.args[0], root);
        assert.equal(self.MockFacade.firstCall.args[1], options);
    });

    it('exposes a `createRenderer()` function', () => {
        assert.typeOf(self.factory.createRenderer, 'function');
    });

    describe('#createRenderer()', () => {
        it('returns an instance of `RendererFacade`', () => {
            const renderer = self.factory.createRenderer();

            assert.instanceOf(renderer, RendererFacade);
        });

        it('passes a consumber-provided "custom blocks" hash to the renderer', () => {
            const customBlocks = {
                foo: null
            };

            const renderer = self.factory.createRenderer(customBlocks);

            assert.deepEqual(renderer.customBlocks, customBlocks);
        });
    });
});