# How to Configure Task Scheduler # 
<h3> Creating Task Delete_LocalRoot </h3>

Task that will delete file `root.json` database credentials stored in the `back-end\data\local_credentials` directory upon operating system shutdown <b>(it won't work if you use the Power Button)</b>
<br/>
<br/>

1. Open `Task Scheduler` app, click on `Create Task`, name the task `Delete_LocalRoot`
2. Go to `Actions`, create a new Action by clicking on New, click Browse, select file `delLocalRoot` in the directory `back-end\data\local_credentials`, click Ok
3. Go to `Triggers`, create a new Trigger by clicking on New, select the `On an event` option in `Begin the task`
5. Select the `Custom` option, click `New Event Filter...`, go to the XML section, select the `Edit query manually` option, paste this code
<p>
<b>(Be careful with line breaks and spaces, the syntax is very sensitive)</b>
</p>
