describe('d2l-organization-info', () => {
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
		var semesterEntity = {
			properties: {
				name: 'Semester Name'
			}
		};
		var presentationEntity = {
			properties: {
				ShowCourseCode: true,
				ShowSemester: true
			}
		};

		fetchStub = sandbox.stub(window.d2lfetch, 'fetch');
		fetchStub
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
		beforeEach(done => {
			component = fixture('no-params');
			setTimeout(() => {
				done();
			}, 100);
		});

		afterEach(() => {
			sandbox.restore();
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

		it('should call _sendVoiceReaderInfo upon changes to _showOrganizationCode, _showSemesterName, _organizationCode or _semesterName', () => {
			var spy = sandbox.spy(component, '_sendVoiceReaderInfo');

			component._semesterName = 'Semester Name';
			component._showSemesterName = true;
			component._organizationCode = 'PMATH350';
			component._showOrganizationCode = true;
			expect(spy).to.have.been.called;

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

	describe('Events', () => {
		beforeEach(done => {
			component = fixture('with-href-and-presentation-href');
			setTimeout(() => {
				done();
			}, 100);
		});

		it('d2l-organization-accessible should have semesterName.', done => {
			component.addEventListener('d2l-organization-accessible', function(e) {
				expect(e.detail.semesterName).to.equal('New Name');
				done();
			});
			component._semesterName = 'New Name';

		});

		it('d2l-organization-accessible should have course code.', done => {
			component.addEventListener('d2l-organization-accessible', function(e) {
				expect(e.detail.organization.code).to.equal('PMATH350');
				done();
			});
			component._organizationCode = 'PMATH350';

		});

	});

});
