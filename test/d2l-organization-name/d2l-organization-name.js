describe('d2l-organization-name', () => {
	var sandbox,
		component,
		fetchStub;

	beforeEach(() => {
		sandbox = sinon.sandbox.create();

		var organizationEntity = {
			properties: {
				name: 'Course Name',
				code: 'SCI100',
				startDate: null,
				endDate: null,
				isActive: false
			},
			links: [{
				rel: ['https://api.brightspace.com/rels/parent-semester'],
				href: '/semester.json'
			}]
		};

		fetchStub = sandbox.stub(window.D2L.Siren.EntityStore, 'fetch');
		fetchStub
			.withArgs(sinon.match('/organization.json'), sinon.match.any, sinon.match.any)
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(organizationEntity); }
			}));
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('observers', () => {
		beforeEach(() => {
			component = fixture('no-params');
		});

		it('should call _sendVoiceReaderInfo upon changes to _organizationName', () => {
			var spy = sandbox.spy(component, '_sendVoiceReaderInfo');

			component.set('_organizationName', 'Course Name');
			expect(spy).to.have.been.calledOnce;
		});

	});

	describe('fetching organization', () => {
		beforeEach(() => {
			component = fixture('with-href');
		});

		it('should set the _organizationName', () => {
			expect(component._organizationName).to.equal('Course Name');
		});

	});

});
