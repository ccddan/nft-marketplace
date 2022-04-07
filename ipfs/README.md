# Local Inter Planetary File System (IPFS)

**Start IPFS:**

```bash
$ sudo rm -rf data/ export/
$ mkdir data export
$ docker run \
    --rm -d \
    --name ipfs \
    -v $(pwd)/export:/export \
    -v $(pwd)/data:/data/ipfs \
    -p 4001:4001 \
    -p 127.0.0.1:8080:8080 \
    -p 127.0.0.1:5001:5001 \
    ipfs/go-ipfs:latest
```

**Stop IPFS**

```bash
$ docker stop ipfs
```
