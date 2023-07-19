cd frontend
npm run build
cd ..
docker build --tag linguaaudire .
docker tag linguaaudire us-east1-docker.pkg.dev/lingua-audire/cloud-run-source-deploy/lingua-audire
docker push us-east1-docker.pkg.dev/lingua-audire/cloud-run-source-deploy/lingua-audire
gcloud run deploy --image=us-east1-docker.pkg.dev/lingua-audire/cloud-run-source-deploy/lingua-audire