const {client, createTables, createUser, fetchUsers, createSkill, fetchSkills, createUserSkill, fetchUserSkills, destroyUserSkill} = require('./db');

const init = async () => {
  console.log('connecting to database');
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables created');
  const [bart, lisa, homer, mischief, spelling, burping] = await Promise.all([
    createUser({ username: 'bart', password: '321'}),
    createUser({ username: 'lisa', password: 'abc'}),
    createUser({ username: 'homer', password: 'abc'}),
    createSkill({ name: 'mischief'}),
    createSkill({ name: 'spelling'}),
    createSkill({ name: 'burping'})
  ]);
  console.log(await fetchUsers());
  console.log(await fetchSkills());

  const [bartMischief, bartSpelling] = await Promise.all([
    createUserSkill({user_id: bart.id, skill_id: mischief.id}),
    createUserSkill({user_id: bart.id, skill_id: spelling.id}),
  ]);
  console.log(await fetchUserSkills(bart.id));

  // test that this errors! bart does not spell
  // await destroyUserSkill({ user_id: homer.id, id: bartMischief.id });
  
  console.log(await fetchUserSkills(bart.id))
};

init();