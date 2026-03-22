const prisma = require("../config/prisma");

// créer groupe
exports.createGroup = async (req, res) => {
  const group = await prisma.group.create({
    data: { name: req.body.name },
  });

  res.json(group);
};

// voir groupes
exports.getGroups = async (req, res) => {
  const groups = await prisma.group.findMany({
    include: { users: true },
  });

  res.json(groups);
};

// ✅ AJOUTER UTILISATEUR AU GROUPE
exports.addUserToGroup = async (req, res) => {
  const { userId, groupId } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { groupId },
  });

  res.json(user);
};