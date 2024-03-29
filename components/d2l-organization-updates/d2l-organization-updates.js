/**
`d2l-organization-updates`

Polymer-based web component for a organization updates.

@demo demo/d2l-organization-updates/d2l-organization-updates-demo.html Organization Updates
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-icons/d2l-icon.js';
import 'd2l-tooltip/d2l-tooltip.js';
import 'd2l-offscreen/d2l-offscreen.js';
import './d2l-organization-updates-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-organization-updates">
	<template strip-whitespace="">
		<style>
			:host {
				display: flex;
				position: relative;
				margin: auto;
				flex-direction: row;
				flex-wrap: wrap;
				padding-top: 0;
			}
			.organization-updates-container {
				position: relative;
				width: var(--d2l-organization-updates-size, 18px);
				height: var(--d2l-organization-updates-size, 18px);
			}
			.organization-updates-container ~ * {
				margin: 0 0 0 1.95rem;
			}

			:host(:dir(rtl)) .organization-updates-container ~ * {
				margin: 0 1.95rem 0 0;
			}
			d2l-icon {
				--d2l-icon-width: var(--d2l-organization-updates-size, 18px);
				--d2l-icon-height: var(--d2l-organization-updates-size, 18px);
				vertical-align: top;
			}
			.update-text-box {
				border: 2px solid var(--d2l-color-carnelian);
				color: var(--d2l-color-carnelian);
				border-radius: 0.25rem;
				background-color: white;
				box-shadow: 0 0 0 1px white;
			}
			.update-text-big {
				box-sizing: border-box;
				font-size: 1rem;
				font-weight: 700;
				width: 2rem;
				height: 2rem;
				line-height: 2rem;
				display: inline-flex;
				align-items: center;
				justify-content: center;
			}
			.update-text-box-icon {
				position: absolute;
				top: -50%;
				left: 50%;
				padding: 0 0.175rem 0.05rem 0.175rem;
			}
			.update-text-icon {
				color: var(--d2l-color-ferrite);
				line-height: 100%;
				font-weight: 400;
				font-size: 0.555rem;
			}
			.update-text-big[hidden],
			.container[disabled] .update-text-box {
				display: none;
			}
			.container[disabled] d2l-icon {
				color: var(--d2l-color-mica);
			}
			.icon-tooltip {
				width: fit-content;
				@apply --d2l-body-small-text;
				color: #FFFFFF;
				white-space:nowrap;
			}
			.icon-tooltip[disabled] {
				display: none;
			}
			.icon-tooltip ul {
				margin: 0px;
				padding: 0px;
				list-style-type: none;
			}
			.icon-tooltip ul li {
				margin: 0px;
				padding: 0px;
			}
		</style>
		<template is="dom-repeat" items="[[_notifications]]">
			<template is="dom-if" if="[[item.icon]]">
				<span class="organization-updates-container" disabled$="[[item.isDisabled]]" id="[[item.key]]">
					<a href="[[item.link]]">
						<d2l-icon icon="[[item.icon]]"></d2l-icon>
					</a>
					<span class="update-text-box-icon update-text-box">
						<div class="update-text-icon" aria-hidden="true">[[item.updateCount]]</div>
						<d2l-offscreen>[[item.ariaLabel]]</d2l-offscreen>
					</span>
				</span>
				<d2l-tooltip class="icon-tooltip" for="[[item.key]]" position="top" disabled$="[[item.isDisabled]]">
					<ul>
						<template is="dom-repeat" items="[[item.toolTip]]">
							<li>[[item]]</li>
						</template>
					</ul>
				</d2l-tooltip>
			</template>
			<template is="dom-if" if="[[!item.icon]]">
				<span aria-hidden="true" hidden$="[[item.isDisabled]]" class="update-text-big update-text-box">[[item.updateCount]]</span>
				<d2l-offscreen hidden$="[[item.isDisabled]]">[[item.ariaLabel]]</d2l-offscreen>
			</template>
		</template>
	</template>
	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-organization-updates',

	properties: {
		href: String,
		presentationHref: String,
		combined: {
			type: Boolean,
			reflectToAttribute: true,
			value: false
		},

		_notifications: {
			type: Array,
			value: function() { return []; }
		}
	},

	behaviors: [
		D2L.PolymerBehaviors.Organization.Updates.Behavior
	],

	observers: [
		'_fetchNotifications(href, presentationHref, combined)'
	],

	_fetchNotifications: function(notificationsUrl, presentationUrl, combined) {
		if (!notificationsUrl || !presentationUrl) {
			return Promise.resolve();
		}
		return this._orgUpdates_fetch(notificationsUrl, presentationUrl)
			.then(function(notification) {
				this._notifications = this._orgUpdates_notifications(notification, combined);
			}.bind(this));
	}
});
