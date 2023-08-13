'use strict';

/**
 * order controller
 */

const stripe = require('stripe')(process.env.STRAPI_ADMIN_TEST_STRIPE_SECRET_KEY);
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order',({strapi})=>({
    async create(ctx, next){
        const user = ctx.state.user
        const { products, Amount } = ctx.request.body
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Amount,
            currency: 'pkr',
            receipt_email: user.email,
          });
        // use the create method from Strapi enitityService
        const order = await strapi.entityService.create("api::order.order", {
          data: {
            products,
            Amount,
            paymentIntentId: paymentIntent.id,
            Email: user.email,
            // pass in the owner id to define the owner
            owner: user.id,
          }
        })
        return { order }
      },
      async find(ctx, next) {
        const user = ctx.state.user
        ctx.query.filters = {
          ...(ctx.query.filters || {}),
          owner: user.id,
        };
        // destructure to get `data` and `meta` which strapi returns by default
        const {data, meta} = await super.find(ctx)
        
        // perform any other custom action
        return {data, meta}
      },
      async findOne(ctx, next) {
        let { data, meta } = await super.findOne(ctx)
        const paymentIntent = await stripe.paymentIntents.retrieve(
            data.attributes.paymentIntentId
        )
        if (paymentIntent.status === 'succeeded' && data.attributes.Status === 'Pending') {
          const {id} = ctx.request.params
          const updateRes = await strapi.entityService.update("api::order.order", id , {
            data: {
              Name: paymentIntent.shipping.name,
              Status: 'InProcess',
              Address: (paymentIntent.shipping.address.line1 || '') +  ' ' +
                (paymentIntent.shipping.address.line2 || '') + ' ' +
                (paymentIntent.shipping.address.city || ''),
              paymentInfo: {
                id: paymentIntent.id,
                paymentMethod: paymentIntent.payment_method,
                amount: paymentIntent.amount_received,
              }
            }
          })
          const order = await super.findOne(ctx)
          data = order.data;
          meta = order.meta;
        }
        return { data: { ...data, client_secret: paymentIntent.client_secret }, meta }
      }
}))
