function change_time(time){
    var dateTime = new Date(time);

    var formattedDate = dateTime.toLocaleDateString() + ' ' + dateTime.toLocaleTimeString();

    return formattedDate;

  }