describe('d2l-organization-info', () => {
	var sandbox,
		component,
		organizationEntity,
		semesterEntity,
		presentationEntity;

	beforeEach(() => {
		sandbox = sinon.sandbox.create();

		organizationEntity = window.D2L.Hypermedia.Siren.Parse({
			properties: {
				name: 'Course Name',
				code: 'SCI100'
			},
			links: [{
				rel: ['https://api.brightspace.com/rels/parent-semester'],
				href: '/semester.json'
			}]
		});
		semesterEntity = window.D2L.Hypermedia.Siren.Parse({
			properties: {
				name: 'Semester Name'
			}
		});
		presentationEntity = window.D2L.Hypermedia.Siren.Parse({
			properties: {
				ShowCourseCode: true,
				ShowSemester: true
			}
		});

		sandbox.stub(window.d2lfetch, 'fetch')
			.withArgs(sinon.match.has('url', sinon.match('/organization.json')))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(organizationEntity); }
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
			expect(spy).to.have.been.called;

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
});
