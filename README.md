# Blog 📕

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/68a5bb49435a42fbbe36b0176c71da58)](https://app.codacy.com/manual/clonalejandro/Blog?utm_source=github.com&utm_medium=referral&utm_content=clonalejandro/Blog&utm_campaign=Badge_Grade_Dashboard)

A personal tech blog built in Node JS with MongoDB and Pug.

### Use guide

Execute this commands in this project:<br>
- ``npm i``<br>
- ``npm start``

If the port configured is 80 or 443 run like this:
- ``sudo npm start``

Create account in <b>your-url/signup</b> when you have created your account you need to set in the server config: 
- ``"registerAllowed": false``

You can create entries in <b>your-url/panel</b> and click in the top bubble whose icon is plus

### Configuration

- In the <b>assets/data/config.json</b> you can configure the server
- In the <b>views/components/disqus.pug</b> You can configure your own disqus
