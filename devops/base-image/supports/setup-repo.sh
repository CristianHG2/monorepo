GH_TOKEN=$1
GH_REPO=$2

git config --global --add safe.directory /__w/payroll-goat/payroll-goat
git config --global user.name github-actions
git config --global user.email github-actions@github.com

git init
git remote add origin "https://actions-runner:$GH_TOKEN@github.com/$GH_REPO"
git fetch
