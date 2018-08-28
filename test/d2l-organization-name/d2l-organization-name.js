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

		fetchStub = sandbox.stub(window.d2lfetch, 'fetch');
		fetchStub
			.withArgs(sinon.match.has('url', sinon.match('/organization.json')))
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

		it('should call _fetchOrganization upon changes to href', () => {
			var spy = sandbox.spy(component, '_fetchOrganization');
			component.href = '/organization.json';
			expect(spy).to.have.been.called;
		});

		it('should call _sendVoiceReaderInfo upon changes to _organizationName', () => {
			var spy = sandbox.spy(component, '_sendVoiceReaderInfo');

			component._organizationName = 'Course Name';
			expect(spy).to.have.been.calledOnce;
		});

	});

	describe('fetching organization', () => {
		beforeEach(done => {
			component = fixture('with-href');

			setTimeout(() => {
				done();
			}, 100);
		});

		it('should set the _organizationName', () => {
			expect(component._organizationName).to.equal('Course Name');
		});

	});

	describe('Events', () => {
		beforeEach(() => {
			component = fixture('no-params');
		});

		it('should send the "Closed" text when organization ends in past', done => {
			component.addEventListener('d2l-organization-accessible', function(e) {
				expect(e.detail.organization.name).to.contain('Another Course Name');
				done();
			});
			component._organizationName = 'Another Course Name';

		});

	});

});
