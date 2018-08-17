describe('d2l-organization-info', () => {
	var sandbox,
		component,
		fetchStub;

	beforeEach(() => {
		sandbox = sinon.sandbox.create();

		var organizationEntity = window.D2L.Hypermedia.Siren.Parse({
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
		});
		var semesterEntity = window.D2L.Hypermedia.Siren.Parse({
			properties: {
				name: 'Semester Name'
			}
		});
		var presentationEntity = window.D2L.Hypermedia.Siren.Parse({
			properties: {
				ShowCourseCode: true,
				ShowSemester: true
			}
		});
		var futureOrganization = window.D2L.Hypermedia.Siren.Parse({
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
		});
		var endedOrganization = window.D2L.Hypermedia.Siren.Parse({
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
		});

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
			}))
			.withArgs(sinon.match.has('url', sinon.match('/semester.json')))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(semesterEntity); }
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
			component = fixture('no-params');
		});

		it('should call _fetchOrganization upon changes to href', () => {
			var spy = sandbox.spy(component, '_fetchOrganization');
			component.href = '/organization.json';
			expect(spy).to.have.been.called;
		});

		it('should call _fetchPresentation upon changes to presentation-href', () => {
			var spy = sandbox.spy(component, '_fetchPresentation');
			component.presentationHref = '/organization.json';
			expect(spy).to.have.been.called;
		});

		it('should call _fetchSemester upon changes to _organization or _showSemesterName', () => {
			var spy = sandbox.spy(component, '_fetchSemester');

			component._organization = window.D2L.Hypermedia.Siren.Parse({});
			expect(spy).to.have.been.calledOnce;

			component._showSemesterName = true;
			expect(spy.callCount).to.equal(2);
		});
	});

	describe('fetching organization', () => {
		beforeEach(done => {
			component = fixture('with-href');

			setTimeout(() => {
				done();
			}, 100);
		});

		it('should set the _organization', () => {
			expect(component._organization).to.be.an('object');
		});

		it('should set the _organizationName', () => {
			expect(component._organizationName).to.equal('Course Name');
		});

		it('should set the _organizationCode', () => {
			expect(component._organizationCode).to.equal('SCI100');
		});
	});

	describe('fetching presentation entity', () => {
		beforeEach(done => {
			component = fixture('with-href-and-presentation-href');

			setTimeout(() => {
				done();
			}, 100);
		});

		it('should set _showOrganizationCode', () => {
			expect(component._showOrganizationCode).to.be.true;
		});

		it('should set _showSemesterName', () => {
			expect(component._showSemesterName).to.be.true;
		});
	});

	describe('fetching semester', () => {
		beforeEach(done => {
			component = fixture('with-href-and-presentation-href');

			setTimeout(() => {
				done();
			}, 100);
		});

		it('should set _semesterName', () => {
			expect(component._semesterName).to.equal('Semester Name');
		});
	});

	describe('status text', () => {
		it('should display the "Opens on" text when organization starts in future', done => {
			component = fixture('future-organization');

			setTimeout(() => {
				var text = component.$$('d2l-card-content-meta.flex span:not([hidden])');
				expect(text.innerText).to.contain('Opens on ');
				done();
			});
		});

		it('should display the "Closed" text when organization ends in past', done => {
			component = fixture('ended-organization');

			setTimeout(() => {
				var text = component.$$('d2l-card-content-meta.flex span:not([hidden])');
				expect(text.innerText).to.contain('Closed');
				done();
			});
		});

		it('should display the "Inactive" text when organization is inactive', done => {
			component = fixture('with-href');

			setTimeout(() => {
				var text = component.$$('d2l-card-content-meta.flex span:not([hidden])');
				expect(text.innerText).to.contain('(Inactive)');
				done();
			});
		});
	});
});
