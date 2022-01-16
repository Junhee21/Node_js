'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormQuestionResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      const FormQuestion = models.FormQuestion
      FormQuestion.hasMany(FormQuestionResult)
    }
  };
  FormQuestionResult.init({
    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    FormQuestionId: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FormQuestionResult',
  });
  return FormQuestionResult;
};