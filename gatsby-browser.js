exports.onServiceWorkerUpdateFound = o => {
  console.log("SW", JSON.parse(JSON.stringify(o)));
  console.log("SW2", o);
  // const answer = window.confirm(
  //   `This application has been updated. ` +
  //     `Reload to display the latest version?`
  // )
  // const answer = true;
  // if (answer === true) {
  //   window.location.reload(true);
  // }
  //Probably not the right place to do this, but here it is:
  if ("Notification" in window) {
    if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function(result) {
        console.log("Attempted to get permission for Notificatioins", result);
      });
    }
  }
};
exports.onServiceWorkerUpdateReady = o => {
  console.log("OnServiceWorkerUpdateFound", o);
  //window.location.reload(true);
  const answer = window.confirm(
    `This application has been updated. ` +
      `Reload to display the latest version?`
  )

  if (answer === true) {
    window.location.reload()
  }

  if ("Notification" in window) {
    var notification = new Notification("App was updated", {
      body: "Your app has new content"
    });
    setTimeout( notification.close.bind(notification), 3000);
  }
};
