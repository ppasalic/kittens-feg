import {
  ErrorMessage,
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  configure
} from 'vee-validate';
import { required, min, max, alpha_spaces, not_one_of } from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alpha_spaces);
    defineRule('not_one_of', not_one_of);

    defineRule('image_url', (value) => {
      if (!value) {
        return true;
      }

      const requiredPath = '/public/assets/images';
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

      if (!value.includes(requiredPath)) {
        return `The URL must contain '${requiredPath}'.`;
      }

      const pathAfterRequired = value.split(requiredPath)[1];

      if (
        !pathAfterRequired ||
        pathAfterRequired.lastIndexOf('/') === pathAfterRequired.length - 1
      ) {
        return `The URL must contain a filename after '${requiredPath}'.`;
      }

      const filename = pathAfterRequired.split('/').pop();

      const hasValidExtension = validExtensions.some((ext) => filename.endsWith(ext));
      if (!filename || !hasValidExtension) {
        return `The URL must have a valid filename and end with one of the following extensions: ${validExtensions.join(', ')}.`;
      }

      const fileBaseName = filename.slice(0, filename.lastIndexOf('.'));
      if (!fileBaseName || fileBaseName.length === 0) {
        return `The URL must have a valid filename before the extension.`;
      }

      return true;
    });

    defineRule('age_format', (value) => {
      if (!value) {
        return true;
      }

      const regex = /^(\d+)\s+month(s)?$/;
      const match = value.match(regex);

      if (match) {
        const number = parseInt(match[1], 10);
        const unit = match[2];

        if (number === 1 && unit !== 's') {
          return true;
        } else if (number !== 1 && unit === 's') {
          return true;
        }
      }

      return 'Age must be in the format "X month(s)", where X is a number.';
    });

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `This field ${ctx.field} is required.`,
          min: `This field must be at least  ${ctx.rule.params} characters.`,
          max: `This field must be at most  ${ctx.rule.params} characters.`,
          alpha_spaces: `This field must only contain alphabetic characters.`,
          not_one_of: `This field must not be one of the following: ${ctx.rule.params}.`,
          image_url: `The URL must contain '/public/assets/images' and end with a valid image extension.`,
          age_format: `Age must be in the format "X month(s)", where X is a number.`
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid.`;
        return message;
      }
    });
  }
};
