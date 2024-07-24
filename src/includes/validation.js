import {
  ErrorMessage,
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  configure
} from 'vee-validate';
import { required, min, max, alpha_spaces } from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alpha_spaces);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `This field ${ctx.field} is required.`,
          min: `This field must be at least  ${ctx.rule.params} characters.`,
          max: `This field must be at most  ${ctx.rule.params} characters.`,
          alpha_spaces: `This field must only contain alphabetic characters.`
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid.`;
        return message;
      }
    });
  }
};
