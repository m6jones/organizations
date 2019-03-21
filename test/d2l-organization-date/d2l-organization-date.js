describe('d2l-organization-date', () => {
	var sandbox,
		component,
		organizationEntity,
		futureOrganization,
		endsOrganization,
		endedOrganization

	beforeEach(() => {
		sandbox = sinon.sandbox.create();

		organizationEntity = {
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
		futureOrganization = {
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
		endsOrganization = {
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
		endedOrganization = {
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
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('observers', () => {
		beforeEach(() => {
			component = fixture('no-params');
		});

		it('should call _getOrganizationDate upon changes to entity', () => {
			var spy = sandbox.spy(component, '_getOrganizationDate');
			component.entity = organizationEntity;
			expect(spy).to.have.been.called;
		});

		it('should call _setOrganizationDate upon changes to startDate or endDate or entityStatus or hideCourseStartDate and hideCourseEndDate', () => {
			var spy = sandbox.spy(component, '_setOrganizationDate');
			component.entity = futureOrganization;
			component.hideCourseStartDate = true;
			component.hideCourseEndDate = true;
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
			component = fixture('no-params');
			component.entity = futureOrganization;
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
			component = fixture('no-params');
			component.entity = organizationEntity;
			setTimeout(() => {
				done();
			}, 100);
		});

		it('should set hideCourseStartDate', () => {
			expect(component.hideCourseStartDate).to.be.false;
		});

		it('should set hideCourseEndDate', () => {
			expect(component.hideCourseEndDate).to.be.false;
		});
	});

	describe('status text', () => {
		it('should display the "Starts" text when organization starts in future', done => {
			component = fixture('no-params');
			component.entity = futureOrganization;

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text.innerText).to.contain('Starts ');
				done();
			});

		});

		it('should display the "Ended" text when organization ended in past', done => {
			component = fixture('no-params');
			component.entity = endedOrganization;

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text.innerText).to.contain('Ended');
				done();
			});

		});

		it('should display the "Ends" text when organization ends in past', done => {
			component = fixture('no-params');
			component.entity = endsOrganization;

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text.innerText).to.contain('Ends');
				done();
			});

		});

		it('should display the nothing when organization is inactive and is after start date or has no start date', done => {
			component = fixture('no-params');
			component.entity = organizationEntity;

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text).to.be.null;
				done();
			});

		});

		it ('should display nothing when organization starts in future and _hideCourseStartDate is true', done => {
			component = fixture('no-params');
			component.entity = futureOrganization;
			component.hideCourseStartDate = true;

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text).to.be.null;
				done();
			});
		});

		it ('should display nothing when organization ended in past and _hideCourseEndDate is true', done => {
			component = fixture('no-params');
			component.entity = endedOrganization;
			component.hideCourseEndDate = true;

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text).to.be.null;
				done();
			});
		});

		it ('should display nothing when organization ends in past and _hideCourseEndDate is true', done => {
			component = fixture('no-params');
			component.entity = endsOrganization;
			component.hideCourseEndDate = true;

			setTimeout(() => {
				var text = component.$$('span:not([hidden])');
				expect(text).to.be.null;
				done();
			});
		});

		it ('should display the "Starts" text when organization starts in future and _hideCourseStartDate is null', done => {
			component = fixture('no-params');
			component.entity = futureOrganization;
			component.hideCourseEndDate = null;
			component.hideCourseStartDate = null;

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
			component._getOrganizationDate(futureOrganization);
		});

		it('should send event with detail of is closed and after end date to be true when organization ends in past.', done => {
			component.addEventListener('d2l-organization-date', function(e) {
				expect(e.detail.beforeStartDate).to.be.false;
				expect(e.detail.active).to.be.true;
				expect(e.detail.afterEndDate).to.be.true;
				done();
			});
			component.entity = endedOrganization;

		});

		it('should have active false and the rest null when organization is inactive without start date.', done => {
			component.addEventListener('d2l-organization-date', function(e) {
				expect(e.detail.beforeStartDate).to.be.null;
				expect(e.detail.active).to.be.false;
				expect(e.detail.afterEndDate).to.be.null;
				done();
			});
			component.entity = organizationEntity;

		});

		it('should send the "Starts" text when organization starts in future', done => {
			component.addEventListener('d2l-organization-accessible', function(e) {
				expect(e.detail.organization.date).to.contain('Starts ');
				done();
			});
			component.entity = futureOrganization;

		});

		it('should send the "Ends" text when organization ends in past', done => {
			component.addEventListener('d2l-organization-accessible', function(e) {
				expect(e.detail.organization.date).to.contain('Ends ');
				done();
			});
			component.entity = endsOrganization;

		});

		it('should send the "Ended" text when organization ended in past', done => {
			component.addEventListener('d2l-organization-accessible', function(e) {
				expect(e.detail.organization.date).to.contain('Ended ');
				done();
			});
			component.entity = endedOrganization;

		});

	});

});
