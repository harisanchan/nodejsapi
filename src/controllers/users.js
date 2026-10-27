// Sample in-memory data store. Replace with a real database (e.g. MySQL from
// cPanel) for production — this data resets whenever the app restarts.
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];
let nextId = 3;

function findIndex(id) {
  return users.findIndex((u) => u.id === Number(id));
}

exports.list = (req, res) => {
  res.json({ success: true, data: users });
};

exports.get = (req, res) => {
  const user = users[findIndex(req.params.id)];
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

exports.create = (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'name and email are required' });
  }
  const user = { id: nextId++, name, email };
  users.push(user);
  res.status(201).json({ success: true, data: user });
};

exports.update = (req, res) => {
  const index = findIndex(req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'User not found' });
  const { name, email } = req.body || {};
  users[index] = { ...users[index], ...(name && { name }), ...(email && { email }) };
  res.json({ success: true, data: users[index] });
};

exports.remove = (req, res) => {
  const index = findIndex(req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'User not found' });
  const [removed] = users.splice(index, 1);
  res.json({ success: true, data: removed });
};
