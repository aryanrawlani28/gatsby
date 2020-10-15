/**
 * Lets plugins implementing support for other compile-to-js add to the list
 * of "resolvable" file extensions. Gatsby supports `.js` and `.jsx` by default.
 * @returns {Array<string>} array of extensions
 */
export const resolvableExtensions = true

/**
 * Tell plugins to add pages. This extension point is called only after the initial
 * sourcing and transformation of nodes plus creation of the GraphQL schema are
 * complete so you can query your data in order to create pages.
 *
 * See also [the documentation for the action `createPage`](/docs/actions/#createPage).
 * @example
 * const path = require(`path`)
 *
 * exports.createPages = ({ graphql, actions }) => {
 *   const { createPage } = actions
 *   const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)
 *   // Query for markdown nodes to use in creating pages.
 *   // You can query for whatever data you want to create pages for e.g.
 *   // products, portfolio items, landing pages, etc.
 *   // Variables can be added as the second function parameter
 *   return graphql(`
 *     query loadPagesQuery ($limit: Int!) {
 *       allMarkdownRemark(limit: $limit) {
 *         edges {
 *           node {
 *             frontmatter {
 *               slug
 *             }
 *           }
 *         }
 *       }
 *     }
 *   `, { limit: 1000 }).then(result => {
 *     if (result.errors) {
 *       throw result.errors
 *     }
 *
 *     // Create blog post pages.
 *     result.data.allMarkdownRemark.edges.forEach(edge => {
 *       createPage({
 *         // Path for this page — required
 *         path: `${edge.node.frontmatter.slug}`,
 *         component: blogPostTemplate,
 *         context: {
 *           // Add optional context data to be inserted
 *           // as props into the page component..
 *           //
 *           // The context data can also be used as
 *           // arguments to the page GraphQL query.
 *           //
 *           // The page "path" is always available as a GraphQL
 *           // argument.
 *         },
 *       })
 *     })
 *   })
 * }
 */

export const createPages = true

/**
 * Like `createPages` but for plugins who want to manage creating and removing
 * pages themselves in response to changes in data *not* managed by Gatsby.
 * Plugins implementing `createPages` will get called regularly to recompute
 * page information as Gatsby's data changes but those implementing
 * `createPagesStatefully` will not.
 *
 * An example of a plugin that uses this extension point is the plugin
 * [gatsby-plugin-page-creator](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-page-creator)
 * which monitors the `src/pages` directory for the adding and removal of JS
 * pages. As its source of truth, files in the pages directory, is not known by
 * Gatsby, it needs to keep its own state about its world to know when to
 * add and remove pages.
 */
export const createPagesStatefully = true

/**
 * Extension point to tell plugins to source nodes. This API is called during
 * the Gatsby bootstrap sequence. Source plugins use this hook to create nodes.
 * This API is called exactly once per plugin (and once for your site's
 * `gatsby-config.js` file). If you define this hook in `gatsby-node.js` it
 * will be called exactly once after all of your source plugins have finished
 * creating nodes.
 *
 * See also the documentation for [`createNode`](/docs/actions/#createNode).
 * @example
 * exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
 *   const { createNode } = actions
 *
 *   // Data can come from anywhere, but for now create it manually
 *   const myData = {
 *     key: 123,
 *     foo: `The foo field of my node`,
 *     bar: `Baz`
 *   }
 *
 *   const nodeContent = JSON.stringify(myData)
 *
 *   const nodeMeta = {
 *     id: createNodeId(`my-data-${myData.key}`),
 *     parent: null,
 *     children: [],
 *     internal: {
 *       type: `MyNodeType`,
 *       mediaType: `text/html`,
 *       content: nodeContent,
 *       contentDigest: createContentDigest(myData)
 *     }
 *   }
 *
 *   const node = Object.assign({}, myData, nodeMeta)
 *   createNode(node)
 * }
 */
export const sourceNodes = true

/**
 * Called when a new node is created. Plugins wishing to extend or
 * transform nodes created by other plugins should implement this API.
 *
 * See also the documentation for [`createNode`](/docs/actions/#createNode)
 * and [`createNodeField`](/docs/actions/#createNodeField)
 * @example
 * exports.onCreateNode = ({ node, actions }) => {
 *   const { createNode, createNodeField } = actions
 *   // Transform the new node here and create a new node or
 *   // create a new node field.
 * }
 */
export const onCreateNode = true

/**
 * Called when a new node is created before the `onCreateNode` handler is called.
 * This is an optimization that can prevent the `onCreateNode` handler to be scheduled
 * if the plugin already knows it's not interested in processing this node.
 *
 * @gatsbyVersion 2.24.79
 * @example
 * exports.shouldOnCreateNode = (node) => node.internal.type === 'Image'
 */
export const shouldOnCreateNode = true

/**
 * Called when a new page is created. This extension API is useful
 * for programmatically manipulating pages created by other plugins e.g.
 * if you want paths without trailing slashes.
 *
 * There is a mechanism in Gatsby to prevent calling onCreatePage for pages
 * created by the same gatsby-node.js to avoid infinite loops/callback.
 *
 * See the guide [Creating and Modifying Pages](/docs/creating-and-modifying-pages/)
 * for more on this API.
 */
export const onCreatePage = true

/**
 * Called during the creation of the GraphQL schema. Allows plugins
 * to add new fields to the types created from data nodes. It will be called
 * separately for each type.
 *
 * This function should return an object in the shape of
 * [GraphQLFieldConfigMap](https://graphql.org/graphql-js/type/#graphqlobjecttype)
 * which will be appended to fields inferred by Gatsby from data nodes.
 *
 * *Note:* Import GraphQL types from `gatsby/graphql` and don't add the `graphql`
 * package to your project/plugin dependencies to avoid `Schema must
 * contain unique named types but contains multiple types named` errors.
 * `gatsby/graphql` exports all builtin GraphQL types as well as the `GraphQLJSON`
 * type.
 *
 * Many transformer plugins use this to add fields that take arguments.
 *
 * * [`gatsby-transformer-remark`](/packages/gatsby-transformer-remark/)
 * adds an "excerpt" field where the user when writing their query can specify
 * how many characters to prune the markdown source to.
 * * [`gatsby-transformer-sharp`](/packages/gatsby-transformer-sharp/) exposes
 * many image transformation options as GraphQL fields.
 *
 * @param {object} $0
 * @param {object} $0.type Object containing `name` and `nodes`
 * @example
 * import { GraphQLString } from "gatsby/graphql"
 *
 * exports.setFieldsOnGraphQLNodeType = ({ type }) => {
 *   if (type.name === `File`) {
 *     return {
 *       newField: {
 *         type: GraphQLString,
 *         args: {
 *           myArgument: {
 *             type: GraphQLString,
 *           }
 *         },
 *         resolve: (source, fieldArgs) => {
 *           return `Id of this node is ${source.id}.
 *                   Field was called with argument: ${fieldArgs.myArgument}`
 *         }
 *       }
 *     }
 *   }
 *
 *   // by default return empty object
 *   return {}
 * }
 */
export const setFieldsOnGraphQLNodeType = true

/**
 * Customize Gatsby's GraphQL schema by creating type definitions, field
 * extensions or adding third-party schemas.
 *
 * The [`createTypes`](/docs/actions/#createTypes),
 * [`createFieldExtension`](/docs/actions/#createFieldExtension) and
 * [`addThirdPartySchema`](/docs/actions/#addThirdPartySchema) actions
 * are only available in this API. For details on their usage please refer to
 * the actions documentation.
 *
 * This API runs immediately before schema generation. For modifications of the
 * generated schema, e.g. to customize added third-party types, use the
 * [`createResolvers`](/docs/node-apis/#createResolvers) API.
 *
 * @gatsbyVersion 2.12.0
 * @param {object} $0
 * @param {object} $0.actions
 * @param {object} $0.actions.createTypes
 * @param {object} $0.actions.createFieldExtension
 * @param {object} $0.actions.addThirdPartySchema
 * @example
 * exports.createSchemaCustomization = ({ actions }) => {
 *   const { createTypes, createFieldExtension } = actions
 *
 *   createFieldExtension({
 *     name: 'shout',
 *     extend: () => ({
 *       resolve(source, args, context, info) {
 *         return String(source[info.fieldName]).toUpperCase()
 *       }
 *     })
 *   })
 *
 *   const typeDefs = `
 *     type MarkdownRemark implements Node @dontInfer {
 *       frontmatter: Frontmatter
 *     }
 *     type Frontmatter {
 *       title: String!
 *       tagline: String @shout
 *       date: Date @dateformat
 *       image: File @fileByRelativePath
 *     }
 *   `
 *   createTypes(typeDefs)
 * }
 */
export const createSchemaCustomization = true

/**
 * Add custom field resolvers to the GraphQL schema.
 *
 * Allows adding new fields to types by providing field configs, or adding resolver
 * functions to existing fields.
 *
 * Things to note:
 * * Overriding field types is disallowed, instead use the `createTypes`
 *   action. In case of types added from third-party schemas, where this is not
 *   possible, overriding field types is allowed.
 * * New fields will not be available on `filter` and `sort` input types. Extend
 *   types defined with `createTypes` if you need this.
 * * In field configs, types can be referenced as strings.
 * * When extending a field with an existing field resolver, the original
 *   resolver function is available from `info.originalResolver`.
 * * The `createResolvers` API is called as the last step in schema generation.
 *   Thus, an intermediate schema is made available on the `intermediateSchema` property.
 *   In resolver functions themselves, it is recommended to access the final
 *   built schema from `info.schema`.
 * * Gatsby's data layer, including all internal query capabilities, is
 *   exposed on [`context.nodeModel`](/docs/node-model/). The node store can be
 *   queried directly with `getAllNodes`, `getNodeById` and `getNodesByIds`,
 *   while more advanced queries can be composed with `runQuery`. Note that
 *   `runQuery` will call field resolvers before querying, so e.g. foreign-key
 *   fields will be expanded to full nodes. The other methods on `nodeModel`
 *   don't do this.
 * * It is possible to add fields to the root `Query` type.
 * * When using the first resolver argument (`source` in the example below,
 *   often also called `parent` or `root`), take care of the fact that field
 *   resolvers can be called more than once in a query, e.g. when the field is
 *   present both in the input filter and in the selection set. This means that
 *   foreign-key fields on `source` can be either resolved or not-resolved.
 *
 * For fuller examples, see [`using-type-definitions`](https://github.com/gatsbyjs/gatsby/tree/master/examples/using-type-definitions).
 *
 * @gatsbyVersion 2.2.0
 * @param {object} $0
 * @param {GraphQLSchema} $0.intermediateSchema Current GraphQL schema
 * @param {function} $0.createResolvers Add custom resolvers to GraphQL field configs
 * @param {object} $1
 * @param {object} $1.resolvers An object map of GraphQL type names to custom resolver functions
 * @param {object} $1.options Optional createResolvers options
 * @param {object} $1.options.ignoreNonexistentTypes Silences the warning when trying to add resolvers for types that don't exist. Useful for optional extensions.
 * @example
 * exports.createResolvers = ({ createResolvers }) => {
 *   const resolvers = {
 *     Author: {
 *       fullName: {
 *         resolve: (source, args, context, info) => {
 *           return source.firstName + source.lastName
 *         }
 *       },
 *     },
 *     Query: {
 *       allRecentPosts: {
 *         type: [`BlogPost`],
 *         resolve: (source, args, context, info) => {
 *           const posts = context.nodeModel.getAllNodes({ type: `BlogPost` })
 *           const recentPosts = posts.filter(
 *             post => post.publishedAt > Date.UTC(2018, 0, 1)
 *           )
 *           return recentPosts
 *         }
 *       }
 *     }
 *   }
 *   createResolvers(resolvers)
 * }
 */
export const createResolvers = true

/**
 * Ask compile-to-js plugins to process source to JavaScript so the query
 * runner can extract out GraphQL queries for running.
 */
export const preprocessSource = true

/**
 * Tell plugins with expensive "side effects" from queries to start running
 * those now. This is a soon-to-be-replaced API only currently in use by
 * `gatsby-plugin-sharp`.
 */
export const generateSideEffects = true

/**
 * Let plugins extend/mutate the site's Babel configuration by calling
 * [`setBabelPlugin`](/docs/actions/#setBabelPlugin) or
 * [`setBabelPreset`](/docs/actions/#setBabelPreset).
 * @param {object} $0
 * @param {string} $0.stage The current build stage. One of 'develop', 'develop-html',
 * 'build-javascript', or 'build-html'
 * @param {object} $0.actions
 * @param {object} options The Babel configuration
 * @example
 * exports.onCreateBabelConfig = ({ actions }) => {
 *   actions.setBabelPlugin({
 *     name: `babel-plugin-that-i-like`,
 *     options: {}
 *   })
 * }
 */
export const onCreateBabelConfig = true

/**
 * Let plugins extend/mutate the site's webpack configuration.
 *
 * See also the documentation for [`setWebpackConfig`](/docs/actions/#setWebpackConfig).
 *
 * @param {object} $0
 * @param {string} $0.stage The current build stage. One of 'develop', 'develop-html',
 * 'build-javascript', or 'build-html'
 * @param {function} $0.getConfig Returns the current webpack config
 * @param {object} $0.rules A set of preconfigured webpack config rules
 * @param {object} $0.loaders A set of preconfigured webpack config loaders
 * @param {object} $0.plugins A set of preconfigured webpack config plugins
 * @param {object} $0.actions
 * @example
 * exports.onCreateWebpackConfig = ({
 *  stage, getConfig, rules, loaders, actions
 * }) => {
 *   actions.setWebpackConfig({
 *     module: {
 *       rules: [
 *         {
 *           test: 'my-css',
 *           use: [loaders.style(), loaders.css()]
 *         },
 *       ],
 *     },
 *   });
 * }
 */
export const onCreateWebpackConfig = true

/**
 * The first API called during Gatsby execution, runs as soon as plugins are loaded, before cache initialization and bootstrap preparation.
 */
export const onPreInit = true

/**
 * Called once Gatsby has initialized itself and is ready to bootstrap your site.
 */
export const onPreBootstrap = true

/**
 * Called at the end of the bootstrap process after all other extension APIs have been called.
 */
export const onPostBootstrap = true

/**
 * The first extension point called during the build process. Called after the bootstrap has completed but before the build steps start.
 */
export const onPreBuild = true

/**
 * The last extension point called after all other parts of the build process
 * are complete.
 */
export const onPostBuild = true

/**
 * Run before GraphQL queries/fragments are extracted from JavaScript files. Useful for plugins
 * to add more JavaScript files with queries/fragments e.g. from node_modules.
 *
 * See gatsby-transformer-sharp and gatsby-source-contentful for examples.
 */
export const onPreExtractQueries = true

/**
 * Run when the `gatsby develop` server is started. It can be used for adding proxies and Express middleware
 * to the server.
 * @param {object} $0
 * @param {Express} $0.app The [Express app](https://expressjs.com/en/4x/api.html#app) used to run the dev server
 * @example
 * exports.onCreateDevServer = ({ app }) => {
 *   app.get('/hello', function (req, res) {
 *     res.send('hello world')
 *   })
 * }
 */
export const onCreateDevServer = true

/**
 * Called during `gatsby develop` bootstrap to get and validate a plugins options schema
 * @param {Joi} $0.Joi The instance of Joi to define the schema with
 *
 */
export const pluginOptionsSchema = true
