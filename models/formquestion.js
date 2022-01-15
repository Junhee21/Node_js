'use strict';
const { GEOMETRY } = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const Form = models.Form
      Form.hasMany(FormQuestion)
    }
  };
  FormQuestion.init({
    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    FormId: DataTypes.UUID,
    title: DataTypes.STRING,
    questionType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FormQuestion',
  });
  return FormQuestion;
};