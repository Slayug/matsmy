browser.runtime.onMessage.addListener(query => {
    if (query.action === "ask_token") {
        browser.cookies.get({name: 'MMCSRF', url: query.url}).then(cookie => {
            sendCsrfToContent(cookie.value);
        }).catch(error => console.log(error));
    }
});

function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

function sendCsrfToContent(xCsrf) {
    getActiveTab().then(tabs => {
        browser.tabs.sendMessage(
            tabs[0].id,
            {xCsrf}
          ).then(() => {}).catch(error => console.error(error))
    }, error => console.error(error));
}