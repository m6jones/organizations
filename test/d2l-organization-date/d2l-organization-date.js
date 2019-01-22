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
		var endsOrganization = {
			properties: {
				name: 'Course Name',
				code: 'SCI100',
				startDate: '1998-01-01T00:00:00.000Z',
				endDate: '2040-01-01T00:00:00.000Z',
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
		var presentationEntity = {
			properties: {
				HideCourseStartDate: false,
				HideCourseEndDate: false
			}
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
			.withArgs(sinon.match.has('url', sinon.match('/ends-organization.json')))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(endsOrganization); }
			}))
			.withArgs(sinon.match.has('url', sinon.match('/ended-organization.json')))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(endedOrganization); }
			}))
			.withArgs(sinon.match.has('url', sinon.match('/presentation.json')))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(presentationEntity); }
			}));			
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('observers', () => {
		beforeEach(() => {
			component = fixture('with-href');
		});

		it('should call _fetchPresentation upon changes to presentation-href', () => {
			var spy = sandbox.spy(component, '_fetchPresentation');
			component.presentationHref = '/organization.json';
			expect(spy).to.have.been.called;
		});		

		it('should call _fetchOrganizationDate upon changes to href or _hideCourseStartDate and _hideCourseEndDate', () => {
			var spy = sandbox.spy(component, '_fetchOrganizationDate');
			component.href = '/future-organization.json';
			component._hideCourseStartDate = true;
			component._hideCourseEndDate = true;
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
			expect(component._statusText).to.contain('Starts ');
		});
	});

	describe('fetching presentation entity', () => {
		beforeEach(done => {
			component = fixture('with-href');
			setTimeout(() => {
				done();
			}, 100);
		});

		it('should set _hideCourseStartDate', () => {
			expect(component._hideCourseStartDate).to.be.false;
		});

		it('should set _hideCourseEndDate', () => {
			expect(component._hideCourseEndDate).to.be.false;
		});
	});		

	describe('status text', () => {
		it('should display the "Starts" text when organization starts in future', done => {
			component = fixture('future-organization');

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text.innerText).to.contain('Starts ');
				done();
			});

		});

		it('should display the "Ended" text when organization ended in past', done => {
			component = fixture('ended-organization');

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text.innerText).to.contain('Ended');
				done();
			});

		});

		it('should display the "Ends" text when organization ends in past', done => {
			component = fixture('ends-organization');

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text.innerText).to.contain('Ends');
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

		it ('should display nothing when organization starts in future and _hideCourseStartDate is true', done => {
			var spy = sandbox.spy(component, '_fetchOrganizationDate');
			component.href = '/future-organization.json';
			component._hideCourseStartDate = true;

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text).to.be.null;
				done();
			});	
		});

		it ('should display nothing when organization ended in past and _hideCourseEndDate is true', done => {
			var spy = sandbox.spy(component, '_fetchOrganizationDate');
			component.href = '/ended-organization.json';
			component._hideCourseEndDate = true;

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text).to.be.null;
				done();
			});
		});

		it ('should display nothing when organization ends in past and _hideCourseEndDate is true', done => {
			var spy = sandbox.spy(component, '_fetchOrganizationDate');
			component.href = '/ends-organization.json';
			component._hideCourseEndDate = true;

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text).to.be.null;
				done();
			});
		});	

		it ('should display the "Starts" text when organization starts in future and _hideCourseStartDate is null', done => {
			var spy = sandbox.spy(component, '_fetchOrganizationDate');
			component.href = '/future-organization.json';
			component._hideCourseEndDate = null;
			component._hideCourseStartDate = null;

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text.innerText).to.contain('Starts ');
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
				expect(e.detail.active).to.be.true;
				expect(e.detail.afterEndDate).to.be.false;
				done();
			});
			component.href = '/future-organization.json';

		});

		it('should send event with detail of is closed and after end date to be true when organization ends in past.', done => {
			component.addEventListener('d2l-organization-date', function(e) {
				expect(e.detail.beforeStartDate).to.be.false;
				expect(e.detail.active).to.be.true;
				expect(e.detail.afterEndDate).to.be.true;
				done();
			});
			component.href = '/ended-organization.json';

		});

		it('should have active false and the rest null when organization is inactive without start date.', done => {
			component.addEventListener('d2l-organization-date', function(e) {
				expect(e.detail.beforeStartDate).to.be.null;
				expect(e.detail.active).to.be.false;
				expect(e.detail.afterEndDate).to.be.null;
				done();
			});
			component.href = '/organization.json';

		});

		it('should send the "Starts" text when organization starts in future', done => {
			component.addEventListener('d2l-organization-accessible', function(e) {
				expect(e.detail.organization.date).to.contain('Starts ');
				done();
			});
			component.href = '/future-organization.json';

		});

		it('should send the "Ends" text when organization ends in past', done => {
			component.addEventListener('d2l-organization-accessible', function(e) {
				expect(e.detail.organization.date).to.contain('Ends ');
				done();
			});
			component.href = '/ends-organization.json';

		});

		it('should send the "Ended" text when organization ended in past', done => {
			component.addEventListener('d2l-organization-accessible', function(e) {
				expect(e.detail.organization.date).to.contain('Ended ');
				done();
			});
			component.href = '/ended-organization.json';

		});

	});

});
