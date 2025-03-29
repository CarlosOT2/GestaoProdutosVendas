# Task Scheduler Settings # 
<h3> Creating Task Delete_LocalRoot </h3>

Task that will delete file `root.json` database credentials stored in the `back-end\data\local_credentials` directory upon operating system shutdown <b>(it won't work if you use the Power Button)</b>
<br/>
<br/>

1. Open `Task Scheduler` app, click on `Create Task`, name the task to `Delete_LocalRoot`
2. Go to `Actions`, create a new Action by clicking on New, click on Browse, select file `delLocalRoot` in the directory `back-end\data\local_credentials`, click on Ok
3. Go to `Triggers`, create a new Trigger by clicking on New, select the option `On an event` in `Begin the task`
5. Select the `Custom` option, click `New Event Filter...`, go to the section XML, select the option `Edit query manually` , paste this code
<p>
<b>(Be careful with line breaks and spaces, the syntax is very sensitive)</b>
</p>
</p>
<pre><code>&lt;QueryList&gt;
  &lt;Query Id="0" Path="System"&gt;
    &lt;Select Path="System"&gt;
      *[System[EventID=1074]]
      and
      *[EventData[Data[@Name='param5'] and (Data='power off')]]
    &lt;/Select&gt;
  &lt;/Query&gt;
&lt;/QueryList&gt;
</code></pre>

7. Click on Ok, Click on Ok again
8. Go to `General`, in section `Security options` select the option `Run whether user is logged on or not`
9. Finish it by clicking on Ok
