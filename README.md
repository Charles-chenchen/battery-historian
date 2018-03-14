# battery-historian

	主要用于不能翻墙，公司外网权限受限用户使用。
	
	  包含了third_party的closure-compiler，closure-library，flot-axislabels文件，
	  替换googlecdn路径，改为本地JS,部分标签可能无法使用。
	
	若可以翻墙与使用外网的用户请访问https://github.com/google/battery-historian，获取更好的体验。


方法1.使用Docker

若使用docker 请直接运行

	$sudo docker build -f Dockerfile battery-historian

docker image下载成功后，执行以下命令 

	$sudo docker run -d -p 9999:9999 battery-historian

方法2.直接使用GO run battery-historian

a. 下载

	$go get -d -u github.com/google/battery-historian/
	
b.执行

	$cd $GOPATH/src/github.com/google/battery-historian/battery-historian
	$go run cmd/battery-historian/battery-historian.go
