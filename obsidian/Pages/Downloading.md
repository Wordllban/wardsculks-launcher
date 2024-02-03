#page

When users click on a play button on [[Main]] page, we are redirecting them on this page. If this is first time user starts the game for this server, we are starting installation, when it ends, we launch the game. Otherwise, we are verifying integrity of files.
During downloading, in left side we are displaying download speed per second. Right side contains a log output where we show messages about successful(or no) installs. Below of this, we display progress bar that shows progression in the middle in percentes. 

### Things to do
- [ ] Compare releases JSON files to handle config and etc. updates 
- [ ] Optimize message output to show whole list
- [ ] Enrich messages with more information(like time and error)