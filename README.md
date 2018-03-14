# battery-historian
	包含了third_party的closure-compiler，closure-library，flot-axislabels文件。
	替换googlecdn路径，改为本地JS,部分标签无法使用。

1.使用Docker 
	若使用docker 请直接运行
	$sudo docker build -f Dockerfile battery-historian

	docker image下载成功后，执行以下命令 
  $sudo docker run -d -p 9999:9999 battery-historian

2.直接下载battery-historian
	a. 下载
		$go get -d -u github.com/google/battery-historian/
	b.执行
		$cd $GOPATH/src/github.com/google/battery-historian/battery-historian
		$go run cmd/battery-historian/battery-historian.go
  

 
