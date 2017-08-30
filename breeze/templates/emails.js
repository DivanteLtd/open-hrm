'use strict';

exports.validateEmail = (email) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

exports.emailTemplate =
  (email, token, baseUrl) =>
    `<div style="text-align:center;height:auto;padding:40px 0;">
      <h1 style="margin:20px 0;">DivanteHRM</h1>
      <h3 style="margin:20px 0;">If you want to change your password, click below.</h3>
      <div style="font-size:20px;margin-bottom:20px;color:white">Did you forgot password? BreezHRM</div>
        <a style="background-color:white;color:#1d1726;padding:10px 20px;border-radius:10px;"href="${baseUrl}/#/page/generatePass/${email}/${token}">Click here!</a>
    </div>`;
