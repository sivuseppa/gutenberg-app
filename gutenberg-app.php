<?php
/**
 * Plugin Name: My first Gutenberg App
 */
function my_admin_menu() {
	// Create a new admin page for our app.
	add_menu_page(
		__( 'My first Gutenberg app', 'gutenberg' ),
		__( 'My first Gutenberg app', 'gutenberg' ),
		'manage_options',
		'my-first-gutenberg-app',
		function () {
			echo '
            <div id="my-first-gutenberg-app"></div>
        ';
		},
		'dashicons-schedule',
		3
	);
}

add_action( 'admin_menu', 'my_admin_menu' );

function load_custom_wp_admin_scripts( $hook ) {
	// Load only on ?page=my-first-gutenberg-app.
	if ( 'toplevel_page_my-first-gutenberg-app' !== $hook ) {
		return;
	}

	// Load the required WordPress packages.

	// Automatically load imported dependencies and assets version.
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	// Enqueue CSS dependencies.
	foreach ( $asset_file['dependencies'] as $style ) {
		wp_enqueue_style( $style );
	}

	// Load our app.js.
	wp_register_script(
		'my-first-gutenberg-app',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version']
	);
	wp_enqueue_script( 'my-first-gutenberg-app' );

	// Load our style.css.
	wp_register_style(
		'my-first-gutenberg-app',
		plugins_url( 'style.css', __FILE__ ),
		array(),
		$asset_file['version']
	);
	wp_enqueue_style( 'my-first-gutenberg-app' );
}

add_action( 'admin_enqueue_scripts', 'load_custom_wp_admin_scripts' );

function wop_sanitize_array_or_object( $object ) {
	return map_deep( $object, 'sanitize_text_field' );
}


function wop_register_settings() {
	register_setting(
		'wop',
		'wop_custom_field',
		array(
			'type'              => 'string',
			'description'       => __( 'A custom field.', 'wop' ),
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
			'default'           => '',
		)
	);
	register_setting(
		'wop',
		'wop_custom_field_2',
		array(
			'type'              => 'string',
			'description'       => __( 'A custom field 2.', 'wop' ),
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
			'default'           => '',
		)
	);
	register_setting(
		'wop',
		'wop_custom_fields_object',
		array(
			'show_in_rest' => array(
				'name'   => 'wop_object',
				'schema' => array(
					'type'       => 'object',
					'properties' => array(
						'setting_1' => array(
							'description' => esc_html__( 'Setting one.', 'my-textdomain' ),
							'type'        => 'string',
						),
						'setting_2' => array(
							'description' => esc_html__( 'Setting 2 object.', 'my-textdomain' ),
							'type'        => 'object',
						),
					),
				),
			),
			'type'         => 'object',
			// 'description'       => __( 'A custom field.', 'wop' ),
			// 'sanitize_callback' => 'wop_sanitize_array_or_object',
		)
	);
}
add_action( 'admin_init', 'wop_register_settings' );
add_action( 'rest_api_init', 'wop_register_settings' );
