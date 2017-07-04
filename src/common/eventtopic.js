﻿/*
 * Event service based on Publish/Subscribe model.
 * This implementation encapsulate the PubSub.js
 * [https://github.com/mroderick/PubSubJS]
 * and extend customized options and topic model.
*/

import PubSub from 'pubsub-js'

export const Topics = {
    system: {
        all: 'system',
        dashboard: {
            all: 'system.dashboard',
            alarmTimerage: {
                selected: "system.dashboard.alarmTimerange.selected"
            },
            deviceGroup: {
                selectionChanged: "system.dashboard.deviceGroup.selectionChanged",
                changed: "system.dashboard.deviceGroup.changed"
            },
            telemetry: {
                selectionChanged: "system.dashboard.telemetry.selectionChanged"
            }
        },
        device: {
            all: 'system.device',
            diagnose: 'system.device.diagnose',
            selected: 'system.device.selected',
            twin: {
                opened: 'system.device.twin.opened'
            },
        },
        grid: {
            itemSelected: 'system.grid.itemSelected',
            itemsSelected: 'system.grid.itemsSelected'
        }
    }
};

function validateTopic(topic) {
    if(!topic || typeof topic !== 'string' || topic.trim() === '') { 
        throw new Error("Topic must be a non-empty string: " + topic);
    }
}

/**
 *	PubSub.publish( topic, payload, publisher ) -> Boolean
 *	- message (String): The message to publish
 *	- payload: The payload to pass to subscribers
 *  - eventsource: The topic publisher object
 *	Publishes the the message, passing the data to it's subscribers
**/
var publish = function (topic, payload, publisher) {
    validateTopic(topic);
    return PubSub.publish(topic, { payload: payload, publisher: publisher });
}

/**
 *	PubSub.publishSync( topic, payload, publisher) -> Boolean
 *	- message (String): The message to publish
 *	- payload: The payload to pass to subscribers
 *  - publisher: The topic publisher object
 *	Publishes the the message synchronously, passing the payload to it's subscribers
**/
var publishSync = function (topic, payload, publisher) {
    validateTopic(topic);
    return PubSub.publishSync(topic, { payload: payload, publisher: publisher });
}

/**
 *	PubSub.subscribe( message, callback ) -> String
 *	- message (String): The message to subscribe to
 *	- callback (Function): The callback when a new message is published
 *	Subscribes the passed callback to the passed message. Every returned token is unique and should be stored if
 *	you need to unsubscribe
**/
var subscribe = function (topic, callback) {
    validateTopic(topic);
    return PubSub.subscribe(topic, function (topic, data) {
        callback(topic, data.payload, data.publisher);
    });
}

/*Public: Clear subscriptions by the topic
*/
var clearSubscriptions = function (topic) {
    validateTopic(topic);
    return PubSub.clearSubscriptions(topic);
}

/* Public: Clears all subscriptions
    */
var clearAllSubscriptions = function () {
    PubSub.clearAllSubscriptions();
}

/* Public: removes subscriptions.
        * When passed a token, removes a specific subscription.
        * When passed a function, removes all subscriptions for that function
        * When passed a topic, removes all subscriptions for that topic (hierarchy)
        * When passed an Array, removes all subscriptions, functions or topics (hierarchy)
        *
        * value - A token, function or topic to unsubscribe.
        *
        * Examples
        *
        *		// Example 1 - unsubscribing with a token
        *		var token = PubSub.subscribe('mytopic', myFunc);
        *		PubSub.unsubscribe(token);
        *
        *		// Example 2 - unsubscribing with a function
        *		PubSub.unsubscribe(myFunc);
        *
        *		// Example 3 - unsubscribing a topic
        *		PubSub.unsubscribe('mytopic');
        *
        *		// Example 4 - unsubscribing an Array of topic
        *		PubSub.unsubscribe(['uid_1', 'uid_2']);
*/
var unsubscribe = function (value) {
    if (Array.isArray(value)) {
        var results = [];
        value.forEach(function (v) {
            results.push(PubSub.unsubscribe(v));
        });
        return results;
    } else {
        return PubSub.unsubscribe(value);
    }
}

export default {
    subscribe,
    publish,
    publishSync,
    unsubscribe,
    clearSubscriptions,
    clearAllSubscriptions
}