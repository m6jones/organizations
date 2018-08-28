describe('d2l-organization-updates', () => {
	var sandbox,
		component,
		fetchStub,
		notificationEntity,
		presentationEntity;

	function SetupFetchStub(url, entity) {
		fetchStub.withArgs(sinon.match.has('url', sinon.match(url)))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(entity); }
			}));
	}

	beforeEach(() => {
		sandbox = sinon.sandbox.create();

		notificationEntity = {
			properties: {
				UnattemptedQuizzes: -20,
				UnreadAssignmentFeedback: 0,
				UngradedQuizzes: 4,
				UnreadDiscussions: 20,
				UnapprovedDiscussions: 79,
				UnreadAssignmentSubmissions: 200
			},
			links: [{
				rel: ['self'],
				href: '/data/notification.json'
			}]
		};
		presentationEntity = {
			properties: {
				ShowCourseCode: true,
				ShowSemester: true,
				ShowUnattemptedQuizzes: true,
				ShowDropboxUnreadFeedback: true,
				ShowUngradedQuizAttempts: true,
				ShowUnreadDiscussionMessages: true,
				ShowUnreadDropboxSubmissions: true
			}
		};

		fetchStub = sandbox.stub(window.d2lfetch, 'fetch');
		SetupFetchStub('/notification.json', notificationEntity);
		SetupFetchStub('/presentation.json', presentationEntity);
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('observers', () => {
		beforeEach(() => {
			component = fixture('no-params');
		});

		it('should call _fetchNotifications upon changes to href', () => {
			var spy = sandbox.spy(component, '_fetchNotifications');
			component.href = '/notification.json';
			expect(spy).to.have.been.calledOnce;
		});

		it('should call _fetchNotifications and _fetchPresentation upon changes to presentation-href', done => {
			component.href = '';
			var spyNotification = sandbox.spy(component, '_fetchNotifications');
			var spyPresentation = sandbox.spy(component, '_fetchPresentation');

			component.presentationHref = 'presentation.json';

			setTimeout(() => {
				expect(spyPresentation).to.have.been.calledOnce;
				expect(spyNotification).to.have.been.calledOnce;
				done();
			});
		});

	});

	describe('fetching notifications', () => {
		beforeEach(done => {
			component = fixture('with-href-and-presentation-href');

			setTimeout(() => {
				done();
			}, 100);
		});

		it('should set the _notifications', () => {
			expect(component._notifications).to.be.an('object');
		});

		it('should set the _presentation', () => {
			expect(component._presentation).to.be.an('object');
		});

	});

	describe('Counts and icons correct.', () => {
		beforeEach(done => {
			component = fixture('with-href-and-presentation-href');

			setTimeout(() => {
				done();
			}, 100);
		});

		it('Correct Display.', () => {
			// UnattemptedQuizzes: -20,
			var notification = component.$$('#unattemptedQuizzes');
			expect(notification.getAttribute('disabled')).is.equal.true;
			notification = notification.nextSibling;
			notification = notification.nextSibling;
			notification = notification.nextSibling;
			expect(notification.innerHTML).to.contain('Unattempted Quizzes');

			// UnreadAssignmentFeedback: 0,
			notification = component.$$('#unreadAssignmentFeedback');
			expect(notification.getAttribute('disabled')).is.equal.true;
			notification = notification.nextSibling;
			notification = notification.nextSibling;
			notification = notification.nextSibling;
			expect(notification.innerHTML).to.contain('Assignment Feedback');

			// UngradedQuizzes: 4
			notification = component.$$('#ungradedQuizzes');
			expect(notification.getAttribute('disabled')).is.equal.false;
			expect(notification.querySelector('.update-text-icon').innerHTML).is.equal('4');
			notification = notification.nextSibling;
			notification = notification.nextSibling;
			notification = notification.nextSibling;
			expect(notification.innerHTML).to.contain('Ungraded Quizzes');

			// UnreadDiscussions: 20
			// UnapprovedDiscussions: 79
			notification = component.$$('#unreadDiscussions');
			expect(notification.getAttribute('disabled')).is.equal.false;
			expect(notification.querySelector('.update-text-icon').innerHTML).is.equal('99');
			notification = notification.nextSibling;
			notification = notification.nextSibling;
			notification = notification.nextSibling;
			expect(notification.innerHTML).to.contain('Discussions');

			// UnreadAssignmentSubmissions: 200
			notification = component.$$('#unreadAssignmentSubmissions');
			expect(notification.getAttribute('disabled')).is.equal.false;
			expect(notification.querySelector('.update-text-icon').innerHTML).is.equal('99+');
			notification = notification.nextSibling;
			notification = notification.nextSibling;
			notification = notification.nextSibling;
			expect(notification.innerHTML).to.contain('Assignment Submissions');
		});

		it('Combined Display.', done => {
			component.combined = true;
			setTimeout(() => {
				var notification = component.$$('.update-text-big');
				expect(notification.innerHTML).is.equal('99+');
				done();
			});

		});

	});

	describe('Counts and icons correct.', () => {
		beforeEach(done => {
			component = fixture('with-href-and-presentation-href');

			setTimeout(() => {
				done();
			}, 100);
		});

		function testName(testCase) {
			return 'should show ' +
				(testCase.count ? testCase.count : 'no') +
				' notifications';
		}

		[
			{
				properties: {
					ShowUnattemptedQuizzes: true,
					ShowDropboxUnreadFeedback: true,
					ShowUngradedQuizAttempts: true,
					ShowUnreadDiscussionMessages: true,
					ShowUnreadDropboxSubmissions: true,
				},
				count: 5
			},
			{
				properties: {
					ShowUnattemptedQuizzes: false,
					ShowDropboxUnreadFeedback: true,
					ShowUngradedQuizAttempts: true,
					ShowUnreadDiscussionMessages: true,
					ShowUnreadDropboxSubmissions: true,
				},
				count: 4
			},
			{
				properties: {
					ShowUnattemptedQuizzes: false,
					ShowDropboxUnreadFeedback: false,
					ShowUngradedQuizAttempts: true,
					ShowUnreadDiscussionMessages: true,
					ShowUnreadDropboxSubmissions: true,
				},
				count: 3
			},
			{
				properties: {
					ShowUnattemptedQuizzes: false,
					ShowDropboxUnreadFeedback: false,
					ShowUngradedQuizAttempts: false,
					ShowUnreadDiscussionMessages: true,
					ShowUnreadDropboxSubmissions: true,
				},
				count: 2
			},
			{
				properties: {
					ShowUnattemptedQuizzes: false,
					ShowDropboxUnreadFeedback: false,
					ShowUngradedQuizAttempts: false,
					ShowUnreadDiscussionMessages: false,
					ShowUnreadDropboxSubmissions: true,
				},
				count: 1
			},
			{
				properties: {
					ShowUnattemptedQuizzes: false,
					ShowDropboxUnreadFeedback: false,
					ShowUngradedQuizAttempts: false,
					ShowUnreadDiscussionMessages: false,
					ShowUnreadDropboxSubmissions: false,
				},
				count: 0
			}
		].forEach(testCase => {

			it(testName(testCase), done => {
				component._presentation = testCase.properties;

				setTimeout(() => {
					var notifications = Polymer.dom(component.root).querySelectorAll('.container');
					expect(notifications.length).to.equal(testCase.count);
					done();
				});

			});

		});

	});

});
