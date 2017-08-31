const xml = require('@nodert-win10/windows.data.xml.dom');
const notifications = require('@nodert-win10/windows.ui.notifications');
const EventEmitter = require('events');
const util = require('util');
const xmlEscape = require('xml-escape');

const { getAppId, log, getIsCentennial } = require('./utils');

/**
 * A notification similar to the native Windows BadgeNotification.
 */
class BadgeNotification extends EventEmitter {
  constructor(options = {}) {
    super(...arguments);

    const value = parseValue(options.value);
    const appId = options.appId || getAppId();

    const escapedValue = xmlEscape(value.toString());
    const formattedXml = util.format('<badge value="%d"/>', escapedValue);

    let xmlDocument = new xml.XmlDocument();

    // Sometimes, loading broken XML can wreak havoc
    try {
      xmlDocument.loadXml(formattedXml);
    } catch (error) {
      throw new Error(`BadgeNotification: XML creation error: ${error}`);
    }

    log(`Creating new badge notification`);
    log(formattedXml);

    this.badge = new notifications.BadgeNotification(xmlDocument);
    this.notifier = getNotifier(appId);
  }

  static clear() {
    const notifier = getNotifier();
    notifier.clear();
  }

  show() {
    if (!this.badge || !this.notifier)
      return;

    this.notifier.update(bagde);
  }
}

function parseValue(value) {
  if (!value)
    return 'none';

  const numberValue = Number(value);
  if (!Number.isInteger(numberValue))
    return 'none';

  if (numberValue > 100)
    return 100;

  if (numberValue < 0)
    return 0;

  return numberValue;
}

function getNotifier(appId) {
  return getIsCentennial()
    ? notifications.BadgeUpdateManager.CreateBadgeUpdaterForApplication()
    : notifications.BadgeUpdateManager.CreateBadgeUpdaterForApplication(appId);
}

module.exports = BadgeNotification;