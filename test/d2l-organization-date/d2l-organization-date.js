describe('d2l-organization-date', () => {
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
		var futureOrganization = {
			properties: {
				name: 'Course Name',
				code: 'SCI100',
				startDate: '2099-01-01T00:00:00.000Z',
				endDate: '2100-01-01T00:00:00.000Z',
				isActive: true
			},
			links: [{
				rel: ['https://api.brightspace.com/rels/parent-semester'],
				href: '/semester.json'
			}]
		};
		var endedOrganization = {
			properties: {
				name: 'Course Name',
				code: 'SCI100',
				startDate: '1999-01-01T00:00:00.000Z',
				endDate: '2000-01-01T00:00:00.000Z',
				isActive: true
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
			}))
			.withArgs(sinon.match.has('url', sinon.match('/future-organization.json')))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(futureOrganization); }
			}))
			.withArgs(sinon.match.has('url', sinon.match('/ended-organization.json')))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(endedOrganization); }
			}));
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('observers', () => {
		beforeEach(() => {
			component = fixture('no-params');
		});

		it('should call _fetchOrganizationDate upon changes to href', () => {
			var spy = sandbox.spy(component, '_fetchOrganizationDate');
			component.href = '/organization.json';
			expect(spy).to.have.been.called;
		});

		it('should call _sendVoiceReaderInfo upon changes to _statusText', () => {
			var spy = sandbox.spy(component, '_sendVoiceReaderInfo');

			component._statusText = '';
			expect(spy).to.have.been.calledOnce;
		});

	});

	describe('fetching organization', () => {
		beforeEach(done => {
			component = fixture('future-organization');

			setTimeout(() => {
				done();
			}, 100);
		});

		it('should set the _statusText', () => {
			expect(component._statusText).to.contain('Opens on ');
		});
	});

	describe('status text', () => {
		it('should display the "Opens on" text when organization starts in future', done => {
			component = fixture('future-organization');

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text.innerText).to.contain('Opens on ');
				done();
			});

		});

		it('should display the "Closed" text when organization ends in past', done => {
			component = fixture('ended-organization');

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text.innerText).to.contain('Closed');
				done();
			});

		});

		it('should display the nothing when organization is inactive and is after start date or has no start date', done => {
			component = fixture('with-href');

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text).to.be.null;
				done();
			});

		});

	});

	describe('Events', () => {
		beforeEach(() => {
			component = fixture('no-params');
		});

		it('should send event with detail of inactive and before start date as true when organization starts in future.', done => {
			component.addEventListener('d2l-organization-date', function(e) {
				expect(e.detail.beforeStartDate).to.be.true;
				expect(e.detail.inactive).to.be.true;
				expect(e.detail.isClosed).to.be.false;
				expect(e.detail.afterEndDate).to.be.false;
				done();
			});
			component.href = '/future-organization.json';

		});

		it('should send event with detail of is closed and after end date to be true when organization ends in past.', done => {
			component.addEventListener('d2l-organization-date', function(e) {
				expect(e.detail.beforeStartDate).to.be.false;
				expect(e.detail.inactive).to.be.false;
				expect(e.detail.isClosed).to.be.true;
				expect(e.detail.afterEndDate).to.be.true;
				done();
			});
			component.href = '/ended-organization.json';

		});

		it('should have inactive true and the rest false when organization is inactive without start date.', done => {
			component.addEventListener('d2l-organization-date', function(e) {
				expect(e.detail.beforeStartDate).to.be.false;
				expect(e.detail.inactive).to.be.true;
				expect(e.detail.isClosed).to.be.false;
				expect(e.detail.afterEndDate).to.be.false;
				done();
			});
			component.href = '/organization.json';

		});

		it('should send the "Opens on" text when organization starts in future', done => {
			component.addEventListener('d2l-organization-accessible', function(e) {
				expect(e.detail.organization.date).to.contain('Opens on ');
				done();
			});
			component.href = '/future-organization.json';

		});

		it('should send the "Closed" text when organization ends in past', done => {
			component.addEventListener('d2l-organization-accessible', function(e) {
				expect(e.detail.organization.date).to.contain('Closed');
				done();
			});
			component.href = '/ended-organization.json';

		});

	});

});
