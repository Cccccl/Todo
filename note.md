##### pm2
1. pm2 start pm2.yml --env production 
   --env production 对应pm2.yml配置文件里面的env_production
2. pm2 list 查看启动的服务
3. pm2 restart todo! 重启
4. pm2 stop todo! 关闭
5. pm2 log todo! 打印日志

##### nginx
1. 在服务器上部署，通过域名访问的只能通过80端口，不能访问其他的端口
2. 通过nginx做反向代理，nginx监听80端口，nginx接受用户发送到服务器的请求，然后把请求转发到本地的nodejs服务上。
3. 物理服务器有一个应用监听80端口，通过域名访问服务器，所有的请求都会到80端口上，没有其他端口可以指定。这里这个应用就是nginx，nginx监听80端口。  
   用户发送http请求，http://todo.me 到服务器的80端口，也就是nginx监听到。nginx可以做转发。
    1. 可以配置todo.me 对应 8888端口
    2. jnode.me 对应3333端口。
   nginx如上配置之后，nginx会根据域名转到对应端口的nodejs服务上。把todo.me的请求全部转发到todo的node服务上。
4. nginx 处理静态资源文件， 反向代理等等。
