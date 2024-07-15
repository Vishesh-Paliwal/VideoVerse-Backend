const Sequelize = jest.requireActual('sequelize');

class MockSequelize extends Sequelize {
  constructor() {
    super();
  }
  authenticate() {
    return Promise.resolve();
  }
  define(modelName, attributes, options) {
    return class extends Sequelize.Model {};
  }
  sync() {
    return Promise.resolve();
  }
}

module.exports = {
  Sequelize: MockSequelize,
};
