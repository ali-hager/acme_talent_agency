const {
  client,
  createTables,
  createUser,
  fetchUsers,
  createSkill,
  fetchSkills,
  createUserSkill,
  fetchUserSkills,
  destroyUserSkill,
} = require("./db");
const express = require("express");
const app = express();

app.get('/api/skills', async(req, res, next)=>{
  try{
    res.send(await fetchSkills());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users', async(req, res, next)=>{
  try{
    res.send(await fetchUsers());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users/:id/userSkills', async(req, res, next)=>{
  try{
    res.send(await fetchUserSkills(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});


const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");
  const [bart, lisa, homer, mischief, spelling, burping] = await Promise.all([
    createUser({ username: "bart", password: "321" }),
    createUser({ username: "lisa", password: "abc" }),
    createUser({ username: "homer", password: "def" }),
    createSkill({ name: "mischief" }),
    createSkill({ name: "spelling" }),
    createSkill({ name: "burping" }),
  ]);
  console.log(await fetchUsers());
  console.log(await fetchSkills());

  const [bartMischief, bartSpelling] = await Promise.all([
    createUserSkill({ user_id: bart.id, skill_id: mischief.id }),
  ]);
  console.log(await fetchUserSkills(bart.id));

  // test that this errors! bart does not spell
  // await destroyUserSkill({ user_id: homer.id, id: bartMischief.id });

  console.log(await fetchUserSkills(bart.id));

  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.log(`curl localhost:${port}/api/skills`);
    console.log(`curl localhost:${port}/api/users`);
    console.log(`curl localhost:${port}/api/users/${bart.id}/userSkills`);
  });
};

init();
